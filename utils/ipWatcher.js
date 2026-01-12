const fs = require("fs");
const path = require("path");
const https = require("https");
const log = require("./logger");

const file = path.join(__dirname, "../data/ip.json");

function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get("https://api.ipify.org", res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data.trim()));
    }).on("error", reject);
  });
}

function load() {
  if (!fs.existsSync(file)) return { publicIp: null };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(ip) {
  fs.writeFileSync(file, JSON.stringify({ publicIp: ip }, null, 2));
}

module.exports = async (client) => {
  setInterval(async () => {
    try {
      const currentIP = await getPublicIP();
      const stored = load();

      if (stored.publicIp !== currentIP) {
        save(currentIP);

        const ownerId = require("../config/permissions.json").owners[0];
        const owner = await client.users.fetch(ownerId);

        await owner.send(
          `🌍 **Public IP Updated**\n` +
          `\`${stored.publicIp || "N/A"}\` ➜ \`${currentIP}\``
        );

        log(
          { user: { tag: "SYSTEM", id: "IP-WATCH" }, commandName: "IP_UPDATE" },
          "IP_CHANGE",
          "SUCCESS",
          currentIP
        );
      }
    } catch (e) {
      log(
        { user: { tag: "SYSTEM", id: "IP-WATCH" }, commandName: "IP_UPDATE" },
        "IP_CHANGE",
        "FAILED",
        e.toString()
      );
    }
  }, 60 * 1000); // كل دقيقة
};