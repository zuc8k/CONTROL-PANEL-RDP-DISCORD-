const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const file = path.join(dataDir, "ticketConfig.json");

// 🔒 تأكد إن فولدر data موجود
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

// 💾 Save config
function save(data) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  load,
  save
};