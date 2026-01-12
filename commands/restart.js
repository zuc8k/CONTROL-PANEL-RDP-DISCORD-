const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart VPS (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.reply("🔄 Restarting VPS...");
    await run("shutdown /r /t 5");
  }
};