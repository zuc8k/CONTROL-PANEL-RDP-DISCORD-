const { SlashCommandBuilder } = require("discord.js");
const perm = require("../utils/permission");
const store = require("../utils/userStore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("extend")
    .setDescription("Extend VPS subscription (Owner only)")
    .addStringOption(o => o.setName("user").setDescription("Username").setRequired(true))
    .addIntegerOption(o => o.setName("days").setDescription("Extra days").setRequired(true)),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const user = interaction.options.getString("user");
    const days = interaction.options.getInteger("days");

    const users = store.list();
    if (!users[user]) {
      return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    }

    const oldDate = new Date(users[user].expiresAt);
    const newDate = new Date(oldDate.getTime() + days * 86400000);

    users[user].expiresAt = newDate.toISOString();
    require("fs").writeFileSync(
      "./data/users.json",
      JSON.stringify({ users }, null, 2)
    );

    await interaction.reply({
      ephemeral: true,
      content: `✅ Subscription extended for **${user}** by ${days} days.`
    });
  }
};