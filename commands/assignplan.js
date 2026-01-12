const { SlashCommandBuilder } = require("discord.js");
const store = require("../utils/userStore");
const perm = require("../utils/permission");
const log = require("../utils/logger");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("assign-plan")
    .setDescription("Assign plan to user (Owner only)")
    .addStringOption(o => o.setName("user").setDescription("Username").setRequired(true))
    .addIntegerOption(o => o.setName("days").setDescription("Days").setRequired(true)),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      log(interaction, "ASSIGN_PLAN", "FAILED", "Permission denied");
      return interaction.reply({ content: "⛔ Owner only.", ephemeral: true });
    }

    const user = interaction.options.getString("user");
    const days = interaction.options.getInteger("days");
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

    store.add(user, expiresAt);
    log(interaction, "ASSIGN_PLAN", "SUCCESS", `${user} -> ${days} days`);
    await interaction.reply({ ephemeral: true, content: `✅ ${user} expires in ${days} days.` });
  }
};