import fs from "fs";

/// BOT CONFIGURATION
global.bot = {
  name: "⺞ RANZ COLD",
  number: "",
  prefix: ".",
  locale: "id",
  timezone: "Asia/Jakarta",
  newsletterJid: "12036339348273223@newsletter",
  expiredAt: "",
};

/// BOT SETTING
global.setting = JSON.parse(fs.readFileSync("./system/config/setting.json"));
global.saveSetting = () =>
  fs.writeFileSync(
    "./system/config/setting.json",
    JSON.stringify(global.setting),
  );

/// OWNER INFORMATION
global.owner = {
  name: "RanZ",
  number: "62895326205615",
};

global.db = {
  users: JSON.parse(fs.readFileSync("./system/data/users.json")),
  save: (name) => {
    switch (name.toLowerCase()) {
      case "users":
        fs.writeFileSync(
          "./system/data/users.json",
          JSON.stringify(global.db.users),
        );
        break;
    }
  },
};

global.images = {
  logo: "./system/data/images/logo.png",
  banner: "./system/data/images/banner.png",
};

global.mess = {
  dev: "Masih dalam tahap pengembangan",
  spam: "*[Spam start]*: Untuk memberhentikan spam jalankan perintah .restart (Restart bot)",
};
