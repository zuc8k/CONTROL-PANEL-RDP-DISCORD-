const store = {};
module.exports = {
  set: (id, lang) => store[id] = lang,
  get: (id) => store[id] || "ar"
};