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

module.exports = async (interaction) => {
  const cfg = ticketConfig.load();

  // 👮‍♂️ Check staff permission (Role OR Admin)
  const isStaff =
    (cfg.staffRole && interaction.member.roles.cache.has(cfg.staffRole)) ||
    interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels);

  /* ========= OPEN TICKET ========= */
  if (interaction.customId === "ticket_open") {
    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
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
      .setTitle("🎟 Ticket Opened")
      .setDescription(
        `👤 User: ${interaction.user}\n\n` +
        "يرجى توضيح طلبك وسيتم الرد عليك قريبًا."
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

    await channel.send({ embeds: [embed], components: [row] });

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

    const logChannel = interaction.guild.channels.cache.get(cfg.logChannel);
    if (logChannel) {
      logChannel.send(
        `📥 **Ticket Claimed**\n` +
        `👤 Staff: ${interaction.user}\n` +
        `📄 Channel: ${interaction.channel.name}`
      );
    }
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

    const logChannel = interaction.guild.channels.cache.get(cfg.logChannel);
    if (logChannel) {
      logChannel.send(
        `🔁 **Ticket Transferred**\n` +
        `👤 From: ${interaction.user}\n` +
        `➡ To: <@${userId}>\n` +
        `📄 Channel: ${interaction.channel.name}`
      );
    }
  }

  /* ========= CLOSE TICKET (STAFF ONLY) ========= */
  if (interaction.customId === "ticket_close") {
    if (!isStaff) {
      return interaction.reply({
        ephemeral: true,
        content: "⛔ This action is for staff only."
      });
    }

    // الـ Modal بيتعالج في index.js
    // هنا بس نسيبه يكمّل
  }
};