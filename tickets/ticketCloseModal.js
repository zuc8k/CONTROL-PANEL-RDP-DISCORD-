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

  const reasonInput = new TextInputBuilder()
    .setCustomId("reason")
    .setLabel("Reason for closing the ticket")
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setPlaceholder("Write the reason here...");

  modal.addComponents(
    new ActionRowBuilder().addComponents(reasonInput)
  );

  await interaction.showModal(modal);
};