const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock the VPS"),

  async execute(interaction) {
    await interaction.reply("🔓 VPS is now unlocked.");
  }
};