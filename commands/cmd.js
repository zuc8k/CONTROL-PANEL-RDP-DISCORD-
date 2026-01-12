const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd")
    .setDescription("Run CMD command (Owner only)")
    .addStringOption(option =>
      option.setName("command").setDescription("CMD command").setRequired(true)
    ),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "CMD", "FAILED", "Permission denied");
      return interaction.reply({
        content: "⛔ Owner only.",
        ephemeral: true
      });
    }

    const command = interaction.options.getString("command");
    await interaction.deferReply({ ephemeral: true });

    try {
      const output = await run(command);
      log(interaction, "CMD", "SUCCESS", command);
      await interaction.editReply(`🖥️ Output:\n\`\`\`${output}\`\`\``);
    } catch (err) {
      log(interaction, "CMD", "FAILED", err);
      await interaction.editReply(`❌ Error:\n\`\`\`${err}\`\`\``);
    }
  }
};