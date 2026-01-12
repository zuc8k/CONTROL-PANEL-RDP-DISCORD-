const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plan")
    .setDescription("Show VPS plans"),

  async execute(interaction) {
    await interaction.reply({
      ephemeral: true,
      content: `
💳 **Available Plans**
• 1 Day
• 7 Days
• 30 Days

(Plans system ready for automation)
`
    });
  }
};