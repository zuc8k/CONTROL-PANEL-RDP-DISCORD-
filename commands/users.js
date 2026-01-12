const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("users")
    .setDescription("List Windows users (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "USERS", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    try {
      const out = await run(`net user`);
      log(interaction, "USERS", "SUCCESS");
      await interaction.editReply(`👥 **Windows Users:**\n\`\`\`${out}\`\`\``);
    } catch (e) {
      log(interaction, "USERS", "FAILED", e);
      await interaction.editReply(`❌ Error:\n\`\`\`${e}\`\`\``);
    }
  }
};