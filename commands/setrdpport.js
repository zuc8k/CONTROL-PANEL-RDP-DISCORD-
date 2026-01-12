const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");
const rdp = require("../utils/rdpManager");
const fs = require("fs");
const path = require("path");

const ipFile = path.join(__dirname, "../data/ip.json");

function getPublicIP() {
  if (!fs.existsSync(ipFile)) return null;
  return JSON.parse(fs.readFileSync(ipFile, "utf8")).publicIp;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("set-rdp-port")
    .setDescription("Change RDP port (Owner only)")
    .addIntegerOption(o =>
      o.setName("port")
        .setDescription("New RDP port (1024–65535)")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "SET_RDP_PORT", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const newPort = interaction.options.getInteger("port");

    if (newPort < 1024 || newPort > 65535) {
      return interaction.reply({
        ephemeral: true,
        content: "❌ Port must be between 1024 and 65535."
      });
    }

    const oldPort =