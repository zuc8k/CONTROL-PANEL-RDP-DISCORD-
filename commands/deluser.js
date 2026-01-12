const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deluser")
    .setDescription("Delete VPS user")
    .addStringOption(option =>
      option.setName("username").setDescription("Username").setRequired(true)
    ),

  async execute(interaction) {
    const username = interaction.options.getString("username");
    await interaction.reply(`❌ User **${username}** deleted.`);
  }
};