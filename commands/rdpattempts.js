const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rdp-attempts")
    .setDescription("Show RDP login attempts (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const logs = await run(
      `powershell -Command "Get-WinEvent -LogName Security -MaxEvents 10 | Where-Object {$_.Id -eq 4625 -or $_.Id -eq 4624}"`
    );

    await interaction.editReply(`🔐 **RDP Attempts:**\n\`\`\`${logs}\`\`\``);
  }
};