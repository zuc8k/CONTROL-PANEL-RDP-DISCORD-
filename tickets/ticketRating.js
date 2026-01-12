const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const ticketConfig = require("../utils/ticketConfig");

module.exports = async (interaction) => {
  if (!interaction.customId.startsWith("rate_")) return;

  const rating = interaction.customId.split("_")[1];
  const cfg = ticketConfig.load();

  // Log Embed
  const logChannel = interaction.guild.channels.cache.get(cfg.logChannel);
  if (logChannel) {
    const embed = new EmbedBuilder()
      .setTitle("⭐ Ticket Rating")
      .setColor("Gold")
      .addFields(
        { name: "👤 User", value: `${interaction.user}`, inline: true },
        { name: "⭐ Rating", value: `${rating}/5`, inline: true },
        { name: "📄 Ticket", value: interaction.channel.name }
      )
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  }

  await interaction.reply({
    ephemeral: true,
    content: `🙏 شكراً لتقييمك! (${rating}/5)`
  });
};