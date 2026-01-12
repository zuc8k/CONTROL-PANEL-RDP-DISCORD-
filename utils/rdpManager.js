const fs = require("fs");
const path = require("path");

const rdpFile = path.join(__dirname, "../data/rdp.json");

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
  getPort() {
    return loadRDP().port;
  },

  setPort(newPort, publicIp) {
    const rdp = loadRDP();
    rdp.port = newPort;
    rdp.address = publicIp ? `${publicIp}:${newPort}` : null;
    saveRDP(rdp);
  },

  updateAddress(ip) {
    const rdp = loadRDP();
    rdp.address = ip ? `${ip}:${rdp.port}` : null;
    saveRDP(rdp);
    return rdp.address;
  },

  getAddress() {
    return loadRDP().address;
  }
};