const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delwinuser")
    .setDescription("Delete Windows VPS user")
    .addStringOption(opt =>
      opt.setName("username").setDescription("Username").setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getString("username");

    await interaction.deferReply({ ephemeral: true });

    try {
      await run(`net user ${user} /delete`);
      await interaction.editReply(`❌ Windows user **${user}** deleted.`);
    } catch (err) {
      await interaction.editReply(`❌ Error:\n\`\`\`${err}\`\`\``);
    }
  }
};