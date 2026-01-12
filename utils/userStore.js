const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/users.json");

function load() {
  if (!fs.existsSync(file)) return { users: {} };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

module.exports = {
  add(username, expiresAt) {
    const data = load();
    data.users[username] = {
      expiresAt,
      active: true,
      notified: false
    };
    save(data);
  },

  disable(username) {
    const data = load();
    if (data.users[username]) {
      data.users[username].active = false;
      save(data);
    }
  },

  markNotified(username) {
    const data = load();
    if (data.users[username]) {
      data.users[username].notified = true;
      save(data);
    }
  },

  list() {
    return load().users;
  }
};