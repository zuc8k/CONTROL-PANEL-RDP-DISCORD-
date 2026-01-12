const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("auto-cleanup")
    .setDescription("Clean temp files (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    await run("del /s /q %temp%\\*");
    await run("cleanmgr /sagerun:1");

    await interaction.editReply("🧹 Cleanup completed successfully.");
  }
};