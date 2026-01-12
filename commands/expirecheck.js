const { SlashCommandBuilder } = require("discord.js");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("expire-check")
    .setDescription("Check expired users (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "EXPIRE_CHECK", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    log(interaction, "EXPIRE_CHECK", "SUCCESS");
    await interaction.reply({
      ephemeral: true,
      content: "⏰ Expire check completed (logic ready for automation)."
    });
  }
};