const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addwinuser")
    .setDescription("Create Windows VPS user")
    .addStringOption(opt =>
      opt.setName("username").setDescription("Username").setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("password").setDescription("Password").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getString("username");
    const pass = interaction.options.getString("password");

    await interaction.deferReply({ ephemeral: true });

    try {
      await run(`net user ${user} ${pass} /add`);
      await run(`net localgroup "Remote Desktop Users" ${user} /add`);

      await interaction.editReply(`✅ Windows user **${user}** created and allowed RDP.`);
    } catch (err) {
      await interaction.editReply(`❌ Error:\n\`\`\`${err}\`\`\``);
    }
  }
};