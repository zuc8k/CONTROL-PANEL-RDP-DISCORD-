const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const store = require("../utils/userStore");
const rdp = require("../utils/rdpManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-vps")
    .setDescription("Create full VPS user (Owner only)")
    .addStringOption(o => o.setName("user").setDescription("Username").setRequired(true))
    .addStringOption(o => o.setName("pass").setDescription("Password").setRequired(true))
    .addIntegerOption(o => o.setName("days").setDescription("Days").setRequired(true)),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const user = interaction.options.getString("user");
    const pass = interaction.options.getString("pass");
    const days = interaction.options.getInteger("days");

    await interaction.deferReply({ ephemeral: true });

    await run(`net user ${user} ${pass} /add`);
    await run(`net localgroup "Remote Desktop Users" ${user} /add`);

    const expiresAt = new Date(Date.now() + days * 86400000).toISOString();
    store.add(user, expiresAt);

    const rdpAddress = rdp.getAddress() || "IP not ready";

    await interaction.editReply(
      `✅ **VPS Created**\n` +
      `👤 User: ${user}\n` +
      `⏳ Days: ${days}\n` +
      `🖥 RDP: \`${rdpAddress}\``
    );
  }
};