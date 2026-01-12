const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const file = path.join(dataDir, "ticketConfig.json");

// 🔒 تأكد إن فولدر data وملف الإعدادات موجودين
function ensure() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          category: null,
          panelChannel: null,
          logChannel: null,
          staffRole: null,              // 👥 رول الاستاف
          subscriptionsChannel: null,  // 🖥 قناة الاشتراكات
          ratingsChannel: null,        // ⭐ قناة التقييمات
          panelImage: null,
          insideImage: null
        },
        null,
        2
      )
    );
  }
}

// 📥 Load config
function load() {
  ensure();
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

// 💾 Save config (دمج بدون مسح)
function save(data) {
  ensure();

  const current = load();
  const finalData = {
    ...current,
    ...data
  };

  fs.writeFileSync(file, JSON.stringify(finalData, null, 2));
}

module.exports = {
  load,
  save
};