const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the VPS"),

  async execute(interaction) {
    await interaction.reply("🔄 Restarting VPS...");
    await run("shutdown /r /t 5");
  }
};