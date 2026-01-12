const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banip")
    .setDescription("Ban IP from RDP (Owner only)")
    .addStringOption(o => o.setName("ip").setDescription("IP Address").setRequired(true)),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id))
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });

    const ip = interaction.options.getString("ip");
    await run(
      `netsh advfirewall firewall add rule name="RDP-MANUAL-${ip}" dir=in action=block protocol=TCP remoteip=${ip}`
    );

    log(interaction, "BAN_IP", "SUCCESS", ip);
    await interaction.reply({ ephemeral: true, content: `🚫 IP ${ip} banned.` });
  }
};