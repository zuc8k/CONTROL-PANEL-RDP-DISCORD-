const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Bot help & command menu"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Bot Help Menu")
      .setColor("Blue")
      .setDescription(
        "اختار النظام اللي محتاجه من المينيو 👇\n\n" +
        "🎟 **Ticket** — استخدام للكل\n" +
        "🖥 **VPS** — إدارة واشتراكات\n" +
        "🌍 **Public** — أوامر عامة\n" +
        "👑 **Owner** — أوامر المالك فقط"
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("help_menu")
      .setPlaceholder("📂 Select system")
      .addOptions(
        {
          label: "🎟 Ticket System",
          value: "ticket",
          description: "Ticket commands"
        },
        {
          label: "🖥 VPS System",
          value: "vps",
          description: "VPS management"
        },
        {
          label: "🌍 Public Commands",
          value: "public",
          description: "Commands for everyone"
        },
        {
          label: "👑 Owner Commands",
          value: "owner",
          description: "Owner only"
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