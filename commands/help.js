const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

const i18n = require("../utils/i18n");
const { ownerId } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show bot help menu"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const isOwner = userId === ownerId;

    const embed = new EmbedBuilder()
      .setTitle(i18n.t(userId, "help.title"))
      .setDescription(i18n.t(userId, "help.desc"))
      .setColor("Blue");

    // 🧩 الخيارات الأساسية
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

    // 👑 خيار المالك (Owner فقط)
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