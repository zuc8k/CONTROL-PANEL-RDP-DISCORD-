const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addwinuser")
    .setDescription("Create Windows user (Owner only)")
    .addStringOption(opt =>
      opt.setName("username").setDescription("Username").setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("password").setDescription("Password").setRequired(true)
    ),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const user = interaction.options.getString("username");
    const pass = interaction.options.getString("password");

    await interaction.deferReply({ ephemeral: true });

    try {
      await run(`net user ${user} ${pass} /add`);
      await run(`net localgroup "Remote Desktop Users" ${user} /add`);
      await interaction.editReply(`✅ User **${user}** created.`);
    } catch (err) {
      await interaction.editReply(`❌ Error:\n\`\`\`${err}\`\`\``);
    }
  }
};