const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const ticketConfig = require("../utils/ticketConfig");

module.exports = async (interaction) => {
  if (interaction.customId !== "ticket_open") return;

  const cfg = ticketConfig.load();

  if (!cfg.category) {
    return interaction.reply({
      ephemeral: true,
      content: "❌ Ticket system not configured."
    });
  }

  // 🎟 Create ticket channel
  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: cfg.category,
    permissionOverwrites: [
      {
        id: interaction.guild.id,
        deny: [PermissionsBitField.Flags.ViewChannel]
      },
      {
        id: interaction.user.id,
        allow: [
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages
        ]
      }
    ]
  });

  // 🧾 Inside ticket embed
  const embed = new EmbedBuilder()
    .setTitle("🎟 Ticket Opened")
    .setDescription(
      `👤 User: ${interaction.user}\n\n` +
      "يرجى توضيح طلبك وسيتم الرد عليك قريبًا."
    )
    .setColor("Blue");

  if (cfg.insideImage) embed.setImage(cfg.insideImage);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticket_close")
      .setLabel("🔒 Close Ticket")
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    embeds: [embed],
    components: [row]
  });

  await interaction.reply({
    ephemeral: true,
    content: `✅ Ticket created: ${channel}`
  });
};