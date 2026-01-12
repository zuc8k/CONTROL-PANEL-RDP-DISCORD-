const fs = require("fs");
const path = require("path");

const langFile = path.join(__dirname, "../data/lang.json");
const localesPath = path.join(__dirname, "../locales");

// تحميل لغة المستخدم
function getUserLang(userId) {
  if (!fs.existsSync(langFile)) {
    fs.writeFileSync(langFile, JSON.stringify({}, null, 2));
  }

  const data = JSON.parse(fs.readFileSync(langFile, "utf8"));
  return data[userId] || "ar"; // الافتراضي عربي
}

// حفظ لغة المستخدم
function setUserLang(userId, lang) {
  let data = {};
  if (fs.existsSync(langFile)) {
    data = JSON.parse(fs.readFileSync(langFile, "utf8"));
  }
  data[userId] = lang;
  fs.writeFileSync(langFile, JSON.stringify(data, null, 2));
}

// جلب النص المترجم
function t(userId, key, vars = {}) {
  const lang = getUserLang(userId);
  const file = path.join(localesPath, `${lang}.json`);

  if (!fs.existsSync(file)) return key;

  const messages = JSON.parse(fs.readFileSync(file, "utf8"));
  let text = messages[key] || key;

  // متغيرات داخل النص
  for (const v in vars) {
    text = text.replace(`{${v}}`, vars[v]);
  }

  return text;
}

module.exports = {
  t,
  setUserLang,
  getUserLang
};