const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

module.exports = async (interaction) => {
  if (interaction.customId !== "ticket_close") return;

  const modal = new ModalBuilder()
    .setCustomId("close_modal")
    .setTitle("Close Ticket");

  const reason = new TextInputBuilder()
    .setCustomId("reason")
    .setLabel("Reason for closing")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  modal.addComponents(new ActionRowBuilder().addComponents(reason));
  await interaction.showModal(modal);
};