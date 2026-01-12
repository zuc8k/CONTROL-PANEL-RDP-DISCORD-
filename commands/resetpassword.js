const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reset-password")
    .setDescription("Reset Windows user password (Owner only)")
    .addStringOption(o => o.setName("user").setDescription("Username").setRequired(true))
    .addStringOption(o => o.setName("newpass").setDescription("New password").setRequired(true)),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "RESET_PASS", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const user = interaction.options.getString("user");
    const pass = interaction.options.getString("newpass");

    await interaction.deferReply({ ephemeral: true });
    try {
      await run(`net user ${user} ${pass}`);
      log(interaction, "RESET_PASS", "SUCCESS", user);
      await interaction.editReply(`🔑 Password reset for **${user}**`);
    } catch (e) {
      log(interaction, "RESET_PASS", "FAILED", e);
      await interaction.editReply(`❌ Error:\n\`\`\`${e}\`\`\``);
    }
  }
};