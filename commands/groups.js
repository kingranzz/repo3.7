import fs from "fs";

export default {
  description: "Groups",
  onlyOwner: true,
  onlyPremium: false,
  handle: async (sock, m) => {
    const groups = Object.values(await sock.groupFetchAllParticipating());
    if (groups.length < 1) return m.reply("Group tidak ditemukan");
    await sock.sendMessage(
      m.chatId,
      {
        text: `Berikut ini adalah daftar group yang tersedia:

${groups
  .map((group, i) => {
    return `*${i + 1}. ${group.subject}*\n_- GID: ${group.id}_`;
  })
  .join("\n")}`,
        contextInfo: {
          externalAdReply: {
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: "https://whatsapp.com/channel/0029VayUkzGF6sn73SS8Vz1R",
            thumbnail: fs.readFileSync(global.images.logo),
            thumbnailUrl: global.images.logo,
            title: global.bot.name,
          },
        },
      },
      {
        quoted: m.quoted,
      },
    );
  },
};
