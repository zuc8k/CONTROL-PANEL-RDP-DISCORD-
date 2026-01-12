const { SlashCommandBuilder } = require("discord.js");
const perm = require("../utils/permission");
const rdp = require("../utils/rdpManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rdp")
    .setDescription("Get current RDP address (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const address = rdp.getAddress();

    if (!address) {
      return interaction.reply({
        ephemeral: true,
        content: "❌ RDP address not ready yet (no Public IP)."
      });
    }

    await interaction.reply({
      ephemeral: true,
      content: `🖥 **RDP Address:**\n\`${address}\``
    });
  }
};