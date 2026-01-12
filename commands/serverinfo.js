const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get server info"),

  async execute(interaction) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setTitle("🖥 Server Info")
      .setColor("Orange")
      .addFields(
        { name: "Server Name", value: guild.name, inline: true },
        { name: "Members", value: `${guild.memberCount}`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  }
};