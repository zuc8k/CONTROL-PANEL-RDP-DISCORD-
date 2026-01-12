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

// 🎟 أنواع التكت
const TICKET_TYPES = {
  ticket_buy: {
    key: "buy",
    title: "💻 VPS Purchase",
    description: "اكتب تفاصيل طلب شراء الـ VPS"
  },
  ticket_support: {
    key: "support",
    title: "⚙ Technical Support",
    description: "اشرح المشكلة اللي بتواجهك بالتفصيل"
  },
  ticket_payment: {
    key: "payment",
    title: "💳 Payment & Billing",
    description: "اكتب استفسارك بخصوص الدفع"
  }
};

module.exports = async (interaction) => {
  const cfg = ticketConfig.load();

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
        ch.name === `ticket-${type.key}-${interaction.user.id}`
    );

    if (existing) {
      return interaction.reply({
        ephemeral: true,
        content: "❗ عندك تذكرة مفتوحة بالفعل من نفس النوع."
      });
    }

    // 🆕 إنشاء التكت
    const channel = await interaction.guild.channels.create({
      name: `ticket-${type.key}-${interaction.user.id}`,
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
      .setTitle(type.title)
      .setDescription(
        `👤 User: ${interaction.user}\n\n${type.description}`
      )
      .setColor("Blue");

    if (cfg.insideImage) embed.setImage(cfg.insideImage);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_claim")
        .setLabel("📥 Claim")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("ticket_transfer")
        .setLabel("🔁 Transfer")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("ticket_close")
        .setLabel("🔒 Close")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `<@${interaction.user.id}> <@&${cfg.staffRole}>`,
      embeds: [embed],
      components: [row]
    });

    return interaction.reply({
      ephemeral: true,
      content: `✅ Ticket created: ${channel}`
    });
  }

  /* ========= CLAIM TICKET (STAFF ONLY) ========= */
  if (interaction.customId === "ticket_claim") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: "⛔ This action is for staff only."
      });
    }

    await interaction.reply({
      content: `📥 Ticket claimed by ${interaction.user}`
    });
  }

  /* ========= TRANSFER MENU (STAFF ONLY) ========= */
  if (interaction.customId === "ticket_transfer") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: "⛔ This action is for staff only."
      });
    }

    const menu = new ActionRowBuilder().addComponents(
      new UserSelectMenuBuilder()
        .setCustomId("ticket_transfer_user")
        .setPlaceholder("Select staff to transfer ticket")
    );

    return interaction.reply({
      ephemeral: true,
      components: [menu]
    });
  }

  /* ========= TRANSFER ACTION (STAFF ONLY) ========= */
  if (
    interaction.isUserSelectMenu() &&
    interaction.customId === "ticket_transfer_user"
  ) {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: "⛔ This action is for staff only."
      });
    }

    const userId = interaction.values[0];

    await interaction.channel.permissionOverwrites.edit(userId, {
      ViewChannel: true,
      SendMessages: true
    });

    await interaction.reply({
      content: `🔁 Ticket transferred to <@${userId}>`
    });
  }

  /* ========= CLOSE TICKET ========= */
  if (interaction.customId === "ticket_close") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: "⛔ This action is for staff only."
      });
    }
    // Modal الإغلاق بيتفتح ويتعالج في index.js
  }
};