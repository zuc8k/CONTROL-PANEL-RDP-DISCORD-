const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
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
    const panelImage = interaction.options.getString("panel_image");
    const insideImage = interaction.options.getString("inside_image");

    // 🛡️ Simple URL validation
    const isValidUrl = url =>
      !url || url.startsWith("http://") || url.startsWith("https://");

    if (!isValidUrl(panelImage) || !isValidUrl(insideImage)) {
      return interaction.reply({
        ephemeral: true,
        content: "❌ Image URLs must start with http:// or https://"
      });
    }

    const data = {
      panelChannel: interaction.options.getChannel("panel_channel").id,
      category: interaction.options.getChannel("category").id,
      logChannel: interaction.options.getChannel("log_channel").id,
      panelImage: panelImage || null,
      insideImage: insideImage || null
    };

    ticketConfig.save(data);

    await interaction.reply({
      ephemeral: true,
      content:
        "✅ **Ticket system configured successfully!**\n\n" +
        "📌 Panel Channel saved\n" +
        "📂 Category saved\n" +
        "📝 Log Channel saved\n" +
        "🖼 Images configured"
    });
  }
};