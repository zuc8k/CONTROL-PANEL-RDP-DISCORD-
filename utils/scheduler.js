const run = require("./exec");
const log = require("./logger");
const store = require("./userStore");

module.exports = () => {
  setInterval(async () => {
    const users = store.list();
    const now = new Date();

    for (const [username, info] of Object.entries(users)) {
      if (info.active && new Date(info.expiresAt) <= now) {
        try {
          await run(`net user ${username} /active:no`);
          store.disable(username);
          log({ user: { tag: "SYSTEM", id: "AUTO" }, commandName: "AUTO-EXPIRE" },
              "AUTO_DISABLE", "SUCCESS", username);
        } catch (e) {
          log({ user: { tag: "SYSTEM", id: "AUTO" }, commandName: "AUTO-EXPIRE" },
              "AUTO_DISABLE", "FAILED", e);
        }
      }
    }
  }, 60 * 1000); // كل دقيقة
};