const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const i18n = require("../utils/i18n");
const { ownerId } = require("../config.json");
const ticketConfig = require("../utils/ticketConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show bot help menu"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const cfg = ticketConfig.load();

    const isOwner = userId === ownerId;
    const isStaff =
      cfg.staffRole &&
      interaction.member.roles.cache.has(cfg.staffRole);

    const embed = new EmbedBuilder()
      .setTitle(i18n.t(userId, "help.title"))
      .setDescription(i18n.t(userId, "help.desc"))
      .setColor("Blue");

    const options = [
      {
        label: i18n.t(userId, "help.ticket.label"),
        value: "ticket",
        description: i18n.t(userId, "help.ticket.desc"),
        emoji: "🎟"
      },
      {
        label: i18n.t(userId, "help.vps.label"),
        value: "vps",
        description: i18n.t(userId, "help.vps.desc"),
        emoji: "💻"
      },
      {
        label: i18n.t(userId, "help.public.label"),
        value: "public",
        description: i18n.t(userId, "help.public.desc"),
        emoji: "🌍"
      }
    ];

    // 👥 Staff Section
    if (isStaff || isOwner) {
      options.push({
        label: i18n.getUserLang(userId) === "ar" ? "👥 أوامر الإدارة" : "👥 Staff Commands",
        value: "staff",
        description:
          i18n.getUserLang(userId) === "ar"
            ? "أوامر إدارة التذاكر"
            : "Ticket management commands",
        emoji: "🛠"
      });
    }

    // 👑 Owner Section
    if (isOwner) {
      options.push({
        label: i18n.t(userId, "help.owner.label"),
        value: "owner",
        description: i18n.t(userId, "help.owner.desc"),
        emoji: "👑"
      });
    }

    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help_menu")
        .setPlaceholder(i18n.t(userId, "help.select"))
        .addOptions(options)
    );

    await interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: [menu]
    });
  }
};