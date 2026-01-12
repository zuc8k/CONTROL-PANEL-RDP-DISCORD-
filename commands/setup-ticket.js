const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const config = require("../utils/ticketConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ticket")
    .setDescription("Setup ticket system")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(o =>
      o.setName("panel_channel")
        .setDescription("Channel for ticket panel")
        .setRequired(true)
    )
    .addChannelOption(o =>
      o.setName("category")
        .setDescription("Ticket category")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    )
    .addChannelOption(o =>
      o.setName("log_channel")
        .setDescription("Logs channel")
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName("panel_image")
        .setDescription("Ticket panel image URL")
        .setRequired(false)
    )
    .addStringOption(o =>
      o.setName("inside_image")
        .setDescription("Inside ticket image URL")
        .setRequired(false)
    ),

  async execute(interaction) {
    const data = {
      panelChannel: interaction.options.getChannel("panel_channel").id,
      category: interaction.options.getChannel("category").id,
      logChannel: interaction.options.getChannel("log_channel").id,
      panelImage: interaction.options.getString("panel_image"),
      insideImage: interaction.options.getString("inside_image")
    };

    config.save(data);

    await interaction.reply({
      ephemeral: true,
      content: "✅ Ticket system configured successfully."
    });
  }
};