const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock the VPS (maintenance mode)"),

  async execute(interaction) {
    await interaction.reply("🔒 VPS is now locked (maintenance mode).");
  }
};