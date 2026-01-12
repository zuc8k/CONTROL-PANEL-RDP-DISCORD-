const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Shutdown the VPS"),

  async execute(interaction) {
    await interaction.reply("⛔ Shutting down VPS...");
    await run("shutdown /s /t 5");
  }
};