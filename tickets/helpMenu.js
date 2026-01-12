const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { ownerId } = require("../config.json");
const i18n = require("../utils/i18n");
const ticketConfig = require("../utils/ticketConfig");

module.exports = async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "help_menu") return;

  const userId = interaction.user.id;
  const value = interaction.values[0];
  const cfg = ticketConfig.load();

  const isOwner = userId === ownerId;
  const isStaff =
    (cfg.staffRole && interaction.member.roles.cache.has(cfg.staffRole)) ||
    interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);

  let embed;

  /* ========= TICKET ========= */
  if (value === "ticket") {
    embed = new EmbedBuilder()
      .setTitle(i18n.getUserLang(userId) === "ar" ? "🎟 نظام التذاكر" : "🎟 Ticket System")
      .setColor("Green")
      .setDescription(
        i18n.getUserLang(userId) === "ar"
          ? "**استخدام للجميع:**\n" +
            "• فتح تذكرة من الزر\n" +
            "`/help`\n\n" +
            "**Staff:**\n" +
            "• Claim Ticket\n" +
            "• Transfer Ticket\n" +
            "• Close Ticket"
          : "**For everyone:**\n" +
            "• Open ticket from panel\n" +
            "`/help`\n\n" +
            "**Staff:**\n" +
            "• Claim Ticket\n" +
            "• Transfer Ticket\n" +
            "• Close Ticket"
      );
  }

  /* ========= VPS ========= */
  if (value === "vps") {
    embed = new EmbedBuilder()
      .setTitle(i18n.getUserLang(userId) === "ar" ? "🖥 نظام الـ VPS" : "🖥 VPS System")
      .setColor("Purple")
      .setDescription(
        i18n.getUserLang(userId) === "ar"
          ? "**إدارة الـ VPS:**\n" +
            "`/vps-plans`\n" +
            "`/adduser`\n" +
            "`/deluser`\n" +
            "`/lock`\n" +
            "`/unlock`"
          : "**VPS Management:**\n" +
            "`/vps-plans`\n" +
            "`/adduser`\n" +
            "`/deluser`\n" +
            "`/lock`\n" +
            "`/unlock`"
      );
  }

  /* ========= PUBLIC ========= */
  if (value === "public") {
    embed = new EmbedBuilder()
      .setTitle(i18n.getUserLang(userId) === "ar" ? "🌍 أوامر عامة" : "🌍 Public Commands")
      .setColor("Blue")
      .setDescription(
        i18n.getUserLang(userId) === "ar"
          ? "**متاحة للجميع:**\n" +
            "`/help`\n" +
            "`/ping`\n" +
            "`/userinfo`\n" +
            "`/serverinfo`"
          : "**Available for everyone:**\n" +
            "`/help`\n" +
            "`/ping`\n" +
            "`/userinfo`\n" +
            "`/serverinfo`"
      );
  }

  /* ========= STAFF ========= */
  if (value === "staff") {
    if (!isStaff && !isOwner) {
      return interaction.reply({
        ephemeral: true,
        content:
          i18n.getUserLang(userId) === "ar"
            ? "⛔ هذا القسم مخصص للإدارة فقط"
            : "⛔ This section is for staff only"
      });
    }

    embed = new EmbedBuilder()
      .setTitle(i18n.getUserLang(userId) === "ar" ? "👥 أوامر الإدارة" : "👥 Staff Commands")
      .setColor("Orange")
      .setDescription(
        i18n.getUserLang(userId) === "ar"
          ? "**إدارة التذاكر:**\n" +
            "• Claim Ticket\n" +
            "• Transfer Ticket\n" +
            "• Close Ticket\n\n" +
            "**ملاحظات:**\n" +
            "• الرد بسرعة على العملاء\n" +
            "• كتابة سبب الإغلاق"
          : "**Ticket Management:**\n" +
            "• Claim Ticket\n" +
            "• Transfer Ticket\n" +
            "• Close Ticket\n\n" +
            "**Notes:**\n" +
            "• Respond quickly\n" +
            "• Always add close reason"
      );
  }

  /* ========= OWNER ========= */
  if (value === "owner") {
    if (!isOwner) {
      return interaction.reply({
        ephemeral: true,
        content:
          i18n.getUserLang(userId) === "ar"
            ? "⛔ هذا القسم مخصص لمالك البوت فقط"
            : "⛔ This section is for the bot owner only"
      });
    }

    embed = new EmbedBuilder()
      .setTitle("👑 Owner Commands")
      .setColor("Red")
      .setDescription(
        "**Owner Only:**\n" +
        "`/setup-ticket`\n" +
        "`/adduser`\n" +
        "`/deluser`\n" +
        "`/auto-cleanup`\n" +
        "`/vps-info`"
      );
  }

  if (!embed) return;

  await interaction.update({
    embeds: [embed],
    components: interaction.message.components // نخلي المينيو موجود
  });
};