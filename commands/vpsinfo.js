const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const rdp = require("../utils/rdpManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vps-info")
    .setDescription("Show VPS full info (Owner only)"),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });

    const cpu = await run("wmic cpu get loadpercentage");
    const ram = await run("wmic OS get FreePhysicalMemory,TotalVisibleMemorySize");
    const disk = await run("wmic logicaldisk get size,freespace,caption");
    const uptime = process.uptime().toFixed(0);
    const rdpAddress = rdp.getAddress() || "Not ready";

    const embed = new EmbedBuilder()
      .setTitle("🖥 VPS Information")
      .setColor("Green")
      .addFields(
        { name: "CPU Load", value: `\`\`\`${cpu}\`\`\`` },
        { name: "RAM", value: `\`\`\`${ram}\`\`\`` },
        { name: "Disk", value: `\`\`\`${disk}\`\`\`` },
        { name: "Uptime", value: `${uptime} seconds` },
        { name: "RDP", value: `\`${rdpAddress}\`` }
      );

    await interaction.editReply({ embeds: [embed] });
  }
};