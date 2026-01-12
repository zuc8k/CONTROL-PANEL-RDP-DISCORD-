const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Shutdown VPS (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "SHUTDOWN", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    log(interaction, "SHUTDOWN", "SUCCESS");
    await interaction.reply("⛔ Shutting down VPS...");
    await run("shutdown /s /t 5");
  }
};