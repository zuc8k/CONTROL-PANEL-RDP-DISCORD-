const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all bot commands"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📜 Bot Commands")
      .setColor("Blue")
      .setDescription(`
/ping - Check latency
/help - Show commands
/userinfo - User info
/serverinfo - Server info
/adduser - Add VPS user
/deluser - Delete VPS user
/lock - Lock server
/unlock - Unlock server
      `);

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};