const fs = require("fs");
const path = require("path");

const ipFile = path.join(__dirname, "../data/ip.json");
const rdpFile = path.join(__dirname, "../data/rdp.json");

function loadIP() {
  if (!fs.existsSync(ipFile)) return null;
  return JSON.parse(fs.readFileSync(ipFile, "utf8")).publicIp;
}

function loadRDP() {
  if (!fs.existsSync(rdpFile)) {
    fs.writeFileSync(
      rdpFile,
      JSON.stringify({ port: 2004, address: null }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(rdpFile, "utf8"));
}

function saveRDP(data) {
  fs.writeFileSync(rdpFile, JSON.stringify(data, null, 2));
}

module.exports = {
  updateAddress() {
    const ip = loadIP();
    if (!ip) return null;

    const rdp = loadRDP();
    rdp.address = `${ip}:${rdp.port}`;
    saveRDP(rdp);

    return rdp.address;
  },

  getAddress() {
    const rdp = loadRDP();
    return rdp.address;
  }
};