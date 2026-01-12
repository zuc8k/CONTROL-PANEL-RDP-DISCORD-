const run = require("./exec");
const log = require("./logger");
const store = require("./userStore");

// ⏰ قبل الانتهاء بـ 24 ساعة
const WARNING_TIME = 24 * 60 * 60 * 1000;

module.exports = (client) => {
  setInterval(async () => {
    const users = store.list();
    const now = new Date();

    for (const [username, info] of Object.entries(users)) {
      const expireDate = new Date(info.expiresAt);
      const timeLeft = expireDate - now;

      // 🔔 تنبيه قبل الانتهاء
      if (
        info.active &&
        !info.notified &&
        timeLeft > 0 &&
        timeLeft <= WARNING_TIME
      ) {
        try {
          const ownerId = require("../config/permissions.json").owners[0];
          const owner = await client.users.fetch(ownerId);

          await owner.send(
            `🔔 **Warning**\nUser **${username}** will expire in **${Math.ceil(
              timeLeft / (60 * 60 * 1000)
            )} hours**`
          );

          store.markNotified(username);
          log(
            { user: { tag: "SYSTEM", id: "AUTO" }, commandName: "AUTO-WARN" },
            "WARN",
            "SUCCESS",
            username
          );
        } catch (e) {
          log(
            { user: { tag: "SYSTEM", id: "AUTO" }, commandName: "AUTO-WARN" },
            "WARN",
            "FAILED",
            e
          );
        }
      }

      // ⛔ انتهاء الاشتراك
      if (info.active && expireDate <= now) {
        try {
          await run(`net user ${username} /active:no`);
          store.disable(username);

          log(
            { user: { tag: "SYSTEM", id: "AUTO" }, commandName: "AUTO-EXPIRE" },
            "AUTO_DISABLE",
            "SUCCESS",
            username
          );
        } catch (e) {
          log(
            { user: { tag: "SYSTEM", id: "AUTO" }, commandName: "AUTO-EXPIRE" },
            "AUTO_DISABLE",
            "FAILED",
            e
          );
        }
      }
    }
  }, 60 * 1000); // كل دقيقة
};