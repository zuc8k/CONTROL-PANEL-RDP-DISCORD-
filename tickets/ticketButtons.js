const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  UserSelectMenuBuilder
} = require("discord.js");

const ticketConfig = require("../utils/ticketConfig");
const i18n = require("../utils/i18n");

// 🎟 أنواع التكت
const TICKET_TYPES = {
  ticket_buy: {
    key: "buy",
    titleKey: "panel.buy.title",
    descKey: "panel.buy.desc"
  },
  ticket_support: {
    key: "support",
    titleKey: "panel.support.title",
    descKey: "panel.support.desc"
  },
  ticket_payment: {
    key: "payment",
    titleKey: "panel.payment.title",
    descKey: "panel.payment.desc"
  }
};

module.exports = async (interaction) => {
  const cfg = ticketConfig.load();
  const userId = interaction.user.id;

  // 👮‍♂️ صلاحيات الاستاف
  const isStaff =
    (cfg.staffRole && interaction.member.roles.cache.has(cfg.staffRole)) ||
    interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);

  /* ========= OPEN TICKET BY TYPE ========= */
  if (interaction.isButton() && TICKET_TYPES[interaction.customId]) {
    const type = TICKET_TYPES[interaction.customId];

    // ❌ منع تكت مكرر من نفس النوع
    const existing = interaction.guild.channels.cache.find(
      ch =>
        ch.parentId === cfg.category &&
        ch.name === `ticket-${type.key}-${userId}`
    );

    if (existing) {
      return interaction.reply({
        ephemeral: true,
        content: i18n.t(userId, "ticket.exists")
      });
    }

    // 🆕 إنشاء التكت
    const channel = await interaction.guild.channels.create({
      name: `ticket-${type.key}-${userId}`,
      type: ChannelType.GuildText,
      parent: cfg.category,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: userId,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages
          ]
        },
        ...(cfg.staffRole
          ? [
              {
                id: cfg.staffRole,
                allow: [
                  PermissionsBitField.Flags.ViewChannel,
                  PermissionsBitField.Flags.SendMessages
                ]
              }
            ]
          : [])
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle(i18n.t(userId, type.titleKey))
      .setDescription(
        `👤 ${interaction.user}\n\n` +
        i18n.t(userId, type.descKey)
      )
      .setColor("Blue");

    if (cfg.insideImage) embed.setImage(cfg.insideImage);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel(i18n.t(userId, "button.claim"))
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("ticket_transfer")
        .setLabel(i18n.t(userId, "button.transfer"))
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel(i18n.t(userId, "button.close"))
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `<@${userId}> <@&${cfg.staffRole}>`,
      embeds: [embed],
      components: [row]
    });

    return interaction.reply({
      ephemeral: true,
      content: i18n.t(userId, "ticket.created", {
        channel: channel.toString()
      })
    });
  }

  /* ========= CLAIM ========= */
  if (interaction.customId === "ticket_claim") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: i18n.t(userId, "ticket.onlyStaff")
      });
    }

    await interaction.reply({
      content: i18n.t(userId, "ticket.claimed", {
        user: interaction.user.toString()
      })
    });
  }

  /* ========= TRANSFER ========= */
  if (interaction.customId === "ticket_transfer") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: i18n.t(userId, "ticket.onlyStaff")
      });
    }

    const menu = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("ticket_transfer_user")
        .setPlaceholder(i18n.t(userId, "ticket.transfer.select"))
    );

    return interaction.reply({
      ephemeral: true,
      components: [menu]
    });
  }

  /* ========= TRANSFER ACTION ========= */
  if (
    interaction.isUserSelectMenu() &&
    interaction.customId === "ticket_transfer_user"
  ) {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: i18n.t(userId, "ticket.onlyStaff")
      });
    }

    const targetId = interaction.values[0];

    await interaction.channel.permissionOverwrites.edit(targetId, {
      ViewChannel: true,
      SendMessages: true
    });

    await interaction.reply({
      content: i18n.t(userId, "ticket.transferred", {
        user: `<@${targetId}>`
      })
    });
  }

  /* ========= CLOSE ========= */
  if (interaction.customId === "ticket_close") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: i18n.t(userId, "ticket.onlyStaff")
      });
    }
    // Modal الإغلاق بيتعالج في index.js
  }
};