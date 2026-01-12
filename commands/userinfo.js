const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get user info")
    .addUserOption(option =>
      option.setName("user").setDescription("Select user").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user");

    const embed = new EmbedBuilder()
      .setTitle("👤 User Info")
      .setColor("Green")
      .addFields(
        { name: "Username", value: user.tag, inline: true },
        { name: "ID", value: user.id, inline: true }
      )
      .setThumbnail(user.displayAvatarURL());

    await interaction.reply({ embeds: [embed] });
  }
};