const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limit-user")
    .setDescription("Disable Windows user (Owner only)")
    .addStringOption(o => o.setName("user").setDescription("Username").setRequired(true)),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "LIMIT_USER", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const user = interaction.options.getString("user");
    await interaction.deferReply({ ephemeral: true });

    try {
      await run(`net user ${user} /active:no`);
      log(interaction, "LIMIT_USER", "SUCCESS", user);
      await interaction.editReply(`⏳ User **${user}** disabled.`);
    } catch (e) {
      log(interaction, "LIMIT_USER", "FAILED", e);
      await interaction.editReply(`❌ Error:\n\`\`\`${e}\`\`\``);
    }
  }
};