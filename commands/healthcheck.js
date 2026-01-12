const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("health-check")
    .setDescription("Full system health check (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "HEALTH", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    try {
      const cpu = await run(`wmic cpu get loadpercentage`);
      const ram = await run(`wmic OS get FreePhysicalMemory,TotalVisibleMemorySize`);
      const disk = await run(`wmic logicaldisk get size,freespace,caption`);

      log(interaction, "HEALTH", "SUCCESS");

      await interaction.editReply(`
🩺 **System Health**

🧠 CPU:
\`\`\`${cpu}\`\`\`

💾 RAM:
\`\`\`${ram}\`\`\`

📀 Disk:
\`\`\`${disk}\`\`\`
`);
    } catch (e) {
      log(interaction, "HEALTH", "FAILED", e);
      await interaction.editReply(`❌ Error:\n\`\`\`${e}\`\`\``);
    }
  }
};