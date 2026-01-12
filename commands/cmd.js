const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cmd")
    .setDescription("Run CMD command (Owner only)")
    .addStringOption(option =>
      option.setName("command").setDescription("CMD command").setRequired(true)
    ),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({
        content: "⛔ You are not allowed to use this command.",
        ephemeral: true
      });
    }

    const command = interaction.options.getString("command");
    await interaction.deferReply({ ephemeral: true });

    try {
      const output = await run(command);
      await interaction.editReply(
        `🖥️ **Command:**\n\`${command}\`\n\n📤 **Output:**\n\`\`\`${output}\`\`\``
      );
    } catch (err) {
      await interaction.editReply(`❌ Error:\n\`\`\`${err}\`\`\``);
    }
  }
};