const { SlashCommandBuilder } = require("discord.js");
const store = require("../utils/userStore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("my-vps")
    .setDescription("Show VPS info for user")
    .addStringOption(o => o.setName("user").setDescription("Username").setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getString("user");
    const users = store.list();

    if (!users[user]) {
      return interaction.reply({ content: "❌ VPS not found.", ephemeral: true });
    }

    await interaction.reply({
      ephemeral: true,
      content:
        `🖥 **VPS Info**\n` +
        `👤 User: ${user}\n` +
        `⏳ Expires: ${users[user].expiresAt}\n` +
        `📌 Status: ${users[user].active ? "Active" : "Disabled"}`
    });
  }
};