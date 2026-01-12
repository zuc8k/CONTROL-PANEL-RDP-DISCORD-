const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd")
    .setDescription("Run CMD command on the VPS")
    .addStringOption(option =>
      option.setName("command")
        .setDescription("CMD command")
        .setRequired(true)
    ),

  async execute(interaction) {
    const command = interaction.options.getString("command");

    await interaction.deferReply({ ephemeral: true });

    try {
      const output = await run(command);
      await interaction.editReply(`🖥️ **Command:**\n\`${command}\`\n\n📤 **Output:**\n\`\`\`${output}\`\`\``);
    } catch (err) {
      await interaction.editReply(`❌ Error:\n\`\`\`${err}\`\`\``);
    }
  }
};