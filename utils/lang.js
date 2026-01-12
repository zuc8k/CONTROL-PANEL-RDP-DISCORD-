const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/lang.json");

function load() {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function set(userId, lang) {
  const data = load();
  data[userId] = lang;
  save(data);
}

function get(userId) {
  const data = load();
  return data[userId] || "ar"; // الافتراضي عربي
}

module.exports = { set, get };