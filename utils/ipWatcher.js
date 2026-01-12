const fs = require("fs");
const path = require("path");
const https = require("https");
const log = require("./logger");
const rdpManager = require("./rdpManager");

const file = path.join(__dirname, "../data/ip.json");

// ================= GET PUBLIC IP =================
function getPublicIP() {
  return new Promise((resolve, reject) => {
    https
      .get("https://api.ipify.org", res => {
        let data = "";
        res.on("data", chunk => (data += chunk));
        res.on("end", () => resolve(data.trim()));
      })
      .on("error", reject);
  });
}

// ================= LOAD / SAVE =================
function load() {
  if (!fs.existsSync(file)) return { publicIp: null };
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(ip) {
  fs.writeFileSync(file, JSON.stringify({ publicIp: ip }, null, 2));
}

// ================= WATCHER =================
module.exports = async (client) => {
  setInterval(async () => {
    try {
      const currentIP = await getPublicIP();
      const stored = load();

      // 🔁 IP CHANGED OR FIRST TIME
      if (stored.publicIp !== currentIP) {
        save(currentIP);

        // 🔗 Update RDP address automatically
        const rdpAddress = rdpManager.updateAddress();

        // 👑 Notify Owner
        const ownerId = require("../config/permissions.json").owners[0];
        const owner = await client.users.fetch(ownerId);

        await owner.send(
          `🌍 **Public IP Updated**\n` +
          `IP: \`${stored.publicIp || "N/A"}\` ➜ \`${currentIP}\`\n` +
          `🖥 RDP: \`${rdpAddress || "Not ready"}\``
        );

        // 📜 Log success
        log(
          { user: { tag: "SYSTEM", id: "IP-WATCH" }, commandName: "IP_UPDATE" },
          "IP_CHANGE",
          "SUCCESS",
          `${currentIP} | RDP: ${rdpAddress}`
        );
      }
    } catch (e) {
      // 📜 Log failure
      log(
        { user: { tag: "SYSTEM", id: "IP-WATCH" }, commandName: "IP_UPDATE" },
        "IP_CHANGE",
        "FAILED",
        e.toString()
      );
    }
  }, 60 * 1000); // كل دقيقة
};