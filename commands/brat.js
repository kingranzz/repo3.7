import { createSticker } from "wa-sticker-formatter";
import createBrat from "../system/lib/createBrat.cjs";

export default {
  description: "Brat",
  onlyOwner: false,
  onlyPremium: true,
  handle: async (sock, m) => {
    if (!m.args[0]) return m.replyError("Text dibutuhkan");
    const buffer = await createBrat(m.args[0]);
    const sticker = await createSticker(buffer, {
      author: m.pushName || global.owner.name,
      pack: global.bot.name,
      type: "FULL",
    });
    await sock.sendMessage(
      m.chatId,
      {
        sticker: Buffer.from(sticker),
      },
      { quoted: m.quoted },
    );
  },
};
