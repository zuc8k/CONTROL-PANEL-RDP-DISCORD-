const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show bot help menu"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Control Panel")
      .setDescription(
        "اختر النظام اللي محتاجه من المينيو بالأسفل 👇\n\n" +
        "📌 **Ticket** — نظام التذاكر (للجميع)\n" +
        "📌 **VPS** — إدارة واشتراكات VPS\n" +
        "📌 **Public** — أوامر عامة\n" +
        "📌 **Owner** — أوامر المالك فقط"
      )
      .setColor("Blue");

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("📂 Select system")
      .addOptions(
        {
          label: "🎟 Ticket System",
          value: "help_ticket",
          description: "Ticket commands (Public / Staff)"
        },
        {
          label: "🖥 VPS System",
          value: "help_vps",
          description: "VPS & subscriptions"
        },
        {
          label: "🌍 Public Commands",
          value: "help_public",
          description: "Commands for everyone"
        },
        {
          label: "👑 Owner Commands",
          value: "help_owner",
          description: "Owner only commands"
        }
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }
};