import "./system/config/global.js";
import utils from "@bayumahadika/utils";
import chokidar from "chokidar";
import chalk from "chalk";
import {
  makeWASocket,
  Browsers,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  jidDecode,
  DisconnectReason,
  isJidStatusBroadcast,
  isJidGroup,
  getContentType,
} from "@bayumahadika/baileysx";
import { Boom } from "@hapi/boom";
import pino from "pino";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import moment from "moment-timezone";
moment.locale(global.bot.locale);

let usePairingCode = true;

(async () => {
  utils.clearConsole();
  global.bot.commands = await (async () => {
    console.log(chalk.magentaBright.bold("LOAD COMMANDS....\x20"));
    const commands = [];
    const commandPath = path.join(process.cwd(), "commands");
    const files = fs
      .readdirSync("./commands", {
        recursive: true,
      })
      .filter((val) => val.endsWith(".js"))
      .map((filepath) => `${commandPath}/${filepath}`);
    for (let file of files) {
      const command = path.basename(file).replace(".js", "");
      const filecont = (await import(file))?.default;
      const cmdExists = commands.find((cmd) => cmd.command === command);
      if (cmdExists) {
        throw new Error(
          `Terdapat command duplicate\n${file}\n${cmdExists.path}`,
        );
      }
      commands.push({
        command,
        path: file,
        ...filecont,
      });
    }
    utils.clearConsole();
    return commands;
  })();
  if (global.bot.expiredAt) {
    (function validateExpired() {
      const expiredAt = new Date(global.bot.expiredAt).getTime();
      const now = Date.now();

      if (expiredAt <= now) {
        throw new Error(`Script ini sudah kadaluarsa, Silahkan download script terbaru...
  - Owner: ${global.owner.name}
  - WhatsApp Number: ${global.owner.number}`);
      }
      setTimeout(validateExpired, 1000);
    })();
  }
})().then(async function start() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  let sock = makeWASocket({
    version: (await fetchLatestBaileysVersion()).version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: Browsers.ubuntu("Chrome"),
    defaultQueryTimeoutMs: undefined,
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
    printQRInTerminal: !usePairingCode,
    shouldSyncHistoryMessage: () => true,
    msgRetryCounterCache: new NodeCache(),
  });
  const sendmsg = sock.sendMessage;
  sock = {
    ...sock,
    sendMessage: (jid, content, options) =>
      sendmsg(
        jid,
        {
          ...content,
          contextInfo: {
            ...content.contextInfo,
            isForwarded: true,
            forwardingScore: 1,
            forwardedNewsletterMessageInfo: {
              newsletterJid: global.bot.newsletterJid,
              newsletterName: global.bot.name,
              serverMessageId: 101,
            },
          },
        },
        options,
      ),
    quoted: {
      key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast",
      },
      message: {
        conversation: `✅ ${global.bot.name} - ${global.owner.name}`,
      },
    },
  };
  if (usePairingCode && !sock.user && !sock.authState.creds.registered) {
    usePairingCode = !(
      await utils.question(
        chalk.cyanBright("Menggunakan pairing code [Y/n]:\n"),
      )
    )
      .trim()
      .toLowerCase()
      .startsWith("n");
    if (!usePairingCode) return start();
    const phonenumber = (
      await utils.question(
        `${chalk.greenBright(
          "Masukkan nomor WhatsApp (Example: +6285174174657):",
        )}\n`,
      )
    ).replace(/\D/g, "");
    await utils.sleep(1000);
    let code = await sock.requestPairingCode(phonenumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(
      `${chalk.bgGreenBright.black("\x20PAIRING CODE\x20")}${chalk.greenBright(
        `: ${code}`,
      )}`,
    );
  }
  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {
    if (connection === "connecting" && sock.user) {
      sock.user.number = jidDecode(sock.user.id).user;
      console.log(
        `${chalk.bgCyanBright.bold.black("\x20MENGHUBUNGKAN\x20")}: ${
          sock.user.number
        }`,
      );
    }
    if (connection === "open") {
      if (global.bot.newsletterJid)
        await sock.newsletterFollow(global.bot.newsletterJid).catch();
      if (global.bot.number && global.bot.number !== sock.user.number) {
        await sock.logout();
        throw new ReferenceError(
          `Nomor ini tidak diizinkan menggunakan SC ini, Silahkan order di ${global.owner.name}, WA: ${global.owner.number}`,
        );
      }
      console.log(
        `${chalk.bgBlueBright.bold.white("\x20TERHUBUNG\x20")}: ${
          sock.user.number
        }`,
      );
    }
    if (connection === "close") {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      console.log(lastDisconnect.error);
      if (lastDisconnect.error === "Error: Stream Errored (unknown)") {
        process.send("restart");
      } else if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        process.send("restart");
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting...");
        process.send("restart");
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection lost, trying to reconnect");
        process.send("restart");
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "Connection Replaced, Another New Session Opened, Please Close Current Session First",
        );
        sock.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required...");
        start();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(`Device Logged Out, Please Scan Again And Run.`);
        sock.logout();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        start();
      }
    }
  });
  sock.ev.on("creds.update", saveCreds);

  /// ANTICALL
  sock.ev.on("call", (arg) => {
    const { id, from, status } = arg[0];
    if (status === "offer" && global.setting.anticall) {
      sock.rejectCall(id, from).catch(console.log);
    }
  });

  /// MESSAGE UPSERT
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message || (m.message && m.message.protocolMessage)) return;
    if (global.setting.readstory && isJidStatusBroadcast(m.key.remoteJid))
      return sock.readMessages([m.key]).catch(console.log);
    m.id = m.key.id;
    m.chatId = m.key.remoteJid;
    m.isGroup = isJidGroup(m.chatId);
    m.userId = m.isGroup
      ? m.key.participant || `${jidDecode(m.participant).user}@s.whatsapp.net`
      : m.chatId;
    m.fromMe = m.key.fromMe;
    m.itsSelf = jidDecode(m.chatId).user === global.bot.number;
    m.isOwner = jidDecode(m.userId).user === global.owner.number;
    m.isPremium = global.db.users.find(
      (user) => user.id === m.userId && user.premium,
    );
    m.type = getContentType(m.message);
    m.body =
      m.type === "conversation"
        ? m.message.conversation
        : m.message[m.type].text ||
          m.message[m.type].caption ||
          m.message[m.type].message?.buttonsMessage?.contentText ||
          m.message[m.type].selectedButtonId ||
          (m.message[m.type].nativeFlowResponseMessage?.paramsJson
            ? JSON.parse(m.message[m.type].nativeFlowResponseMessage.paramsJson)
                .id
            : "") ||
          "";
    m.text =
      m.type === "conversation"
        ? m.message.conversation
        : m.message[m.type].text ||
          m.message[m.type].caption ||
          m.message[m.type].message?.buttonsMessage?.contentText ||
          m.message[m.type].selectedDisplayText ||
          m.message[m.type].body?.text ||
          "";
    m.isQuoted = m.message[m.type].contextInfo?.quotedMessage
      ? {
          message: m.message[m.type].contextInfo.quotedMessage,
          userId: m.message[m.type].contextInfo.participant,
        }
      : false;
    m.isMentioned =
      m.message[m.type].contextInfo?.mentionedJid?.length > 0
        ? {
            mentionedJid: m.message[m.type].contextInfo.mentionedJid,
          }
        : false;
    m.isForwarded = m.message[m.type].contextInfo?.isForwarded;
    m.isLink =
      /(http:\/\/|https:\/\/)?(www\.)?[a-zA-Z0-9]+\.[a-zA-Z]+(\.[a-zA-Z]+)?(\/[^\s]*)?/g.test(
        m.text,
      );
    m.isCmd = m.body.startsWith(global.bot.prefix);
    m.cmd = m.isCmd
      ? m.body.trim().replace(global.bot.prefix, "").split(" ")[0].toLowerCase()
      : "";
    m.args = m.isCmd
      ? m.body
          .replace(/^\S*\b/g, "")
          .split("|")
          .map((x) => x.trim())
          .filter((x) => x)
      : [];
    m.quoted = {
      key: {
        fromMe: false,
        remoteJid: "status@broadcast",
        participant: "0@s.whatsapp.net",
        id: m.id,
      },
      message: {
        conversation: `💬 ${m.text}`,
      },
    };

    if (global.setting.self && !m.itsSelf) return;
    if (!global.setting.public && !m.fromMe && !m.isOwner) return;

    if (!m.isCmd) return;

    m.reply = (text) =>
      sock.sendMessage(
        m.chatId,
        {
          text,
        },
        {
          quoted: m.quoted,
        },
      );
    m.replyError = (text) =>
      sock.sendMessage(
        m.chatId,
        {
          text: `*ERROR:* ${text}`,
        },
        {
          quoted: {
            key: {
              fromMe: false,
              remoteJid: "status@broadcast",
              participant: "0@s.whatsapp.net",
              id: m.id,
            },
            message: {
              conversation: `❌ ${m.text}`,
            },
          },
        },
      );

    for (let command of global.bot.commands) {
      if (command.command === m.cmd) {
        try {
          if (command.onlyOwner && !m.isOwner && !m.fromMe) return;
          if (command.onlyPremium && !m.isOwner && !m.fromMe && !m.isPremium)
            return;
          console.log(
            `${chalk.bgBlueBright.bold.white("\x20COMMAND\x20")}\x20${chalk.blueBright.bold(m.cmd)}\n- FROM: ${m.userId.split("@")[0]}\n- ARGS: ${m.args}\n- DESC: ${command.description}\n- PATH: ${command.path}`,
          );
          if (command.handle) await command.handle(sock, m);
        } catch (err) {
          console.log(err);
          m.replyError(err.message);
        }
        break;
      }
    }
  });
});

process.on("unhandledRejection", (reason) => {
  if (
    reason instanceof Error &&
    reason.message.includes(
      "ENOSPC: System limit for number of file watchers reached",
    )
  )
    return;
  console.log(reason);
});
process.on("uncaughtException", (error) => {
  console.log(error.message);
});

chokidar
  .watch(process.cwd(), {
    ignored: [
      "**/node_modules/**",
      "**/sessions/**",
      "**/session/**",
      (path, stats) =>
        stats?.isFile() && !path.endsWith(".js") && !path.endsWith(".cjs"),
    ],
    persistent: true,
  })
  .on("all", (event, path) => {
    if (!["change", "error"].includes(event)) return;
    console.log(
      `${chalk.bgRedBright.bold.white("\x20RESTART\x20")} ${chalk.redBright(
        event,
      )}: ${path}`,
    );
    process.send("restart");
  });
