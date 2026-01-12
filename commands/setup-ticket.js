const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const ticketConfig = require("../utils/ticketConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDescription("Setup full ticket system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addChannelOption(o =>
      o.setName("panel_channel")
        .setDescription("Channel where ticket panel will be sent")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )

    .addChannelOption(o =>
      o.setName("category")
        .setDescription("Category where tickets will be created")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )

    .addChannelOption(o =>
      o.setName("log_channel")
        .setDescription("Channel for ticket logs")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )

    .addChannelOption(o =>
      o.setName("subscriptions_channel")
        .setDescription("Channel to show new VPS subscriptions")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )

    .addChannelOption(o =>
      o.setName("ratings_channel")
        .setDescription("Channel to show service ratings")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )

    .addRoleOption(o =>
      o.setName("staff_role")
        .setDescription("Role allowed to manage tickets (staff)")
        .setRequired(true)
    )

    .addStringOption(o =>
      o.setName("panel_image")
        .setDescription("Image URL for ticket panel (optional)")
        .setRequired(false)
    )

    .addStringOption(o =>
      o.setName("inside_image")
        .setDescription("Image URL inside ticket (optional)")
        .setRequired(false)
    ),

  async execute(interaction) {
    const panelChannel = interaction.options.getChannel("panel_channel");
    const panelImage = interaction.options.getString("panel_image");
    const insideImage = interaction.options.getString("inside_image");
    const staffRole = interaction.options.getRole("staff_role");

    ticketConfig.save({
      panelChannel: panelChannel.id,
      category: interaction.options.getChannel("category").id,
      logChannel: interaction.options.getChannel("log_channel").id,
      subscriptionsChannel: interaction.options.getChannel("subscriptions_channel").id,
      ratingsChannel: interaction.options.getChannel("ratings_channel").id,
      staffRole: staffRole.id,
      panelImage: panelImage || null,
      insideImage: insideImage || null
    });

    // 🎟 Ticket Panel Embed
    const embed = new EmbedBuilder()
      .setTitle("🎟 VPS Support & Sales")
      .setDescription(
        "اضغط على الزر بالأسفل لفتح تذكرة\n\n" +
        "💻 شراء VPS\n" +
        "⚙ دعم فني\n" +
        "💳 الدفع والاستفسارات"
      )
      .setColor("Green");

    if (panelImage) embed.setImage(panelImage);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_open")
        .setLabel("🎟 Open Ticket")
        .setStyle(ButtonStyle.Success)
    );

    await panelChannel.send({
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      ephemeral: true,
      content:
        "✅ **Ticket system configured successfully!**\n\n" +
        `👥 Staff Role: <@&${staffRole.id}>\n` +
        `🖥 Subscriptions Channel: <#${interaction.options.getChannel("subscriptions_channel").id}>\n` +
        `⭐ Ratings Channel: <#${interaction.options.getChannel("ratings_channel").id}>\n` +
        "🎟 Ticket panel sent."
    });
  }
};