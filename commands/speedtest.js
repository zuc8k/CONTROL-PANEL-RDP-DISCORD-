const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("speedtest")
    .setDescription("Internet speed test (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "SPEEDTEST", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    try {
      const out = await run(`powershell -Command "Test-NetConnection google.com"`);
      log(interaction, "SPEEDTEST", "SUCCESS");
      await interaction.editReply(`🌐 **Speed Test:**\n\`\`\`${out}\`\`\``);
    } catch (e) {
      log(interaction, "SPEEDTEST", "FAILED", e);
      await interaction.editReply(`❌ Error:\n\`\`\`${e}\`\`\``);
    }
  }
};