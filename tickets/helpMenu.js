const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;
  if (interaction.customId !== "help_menu") return;

  let embed;

  if (interaction.values[0] === "ticket") {
    embed = new EmbedBuilder()
      .setTitle("🎟 Ticket System")
      .setColor("Green")
      .setDescription(
        "**استخدام للكل:**\n" +
        "• فتح تذكرة من الزر\n" +
        "`/help`\n\n" +
        "**Staff:**\n" +
        "• Claim Ticket\n" +
        "• Transfer Ticket\n" +
        "• Close Ticket"
      );
  }

  if (interaction.values[0] === "vps") {
    embed = new EmbedBuilder()
      .setTitle("🖥 VPS System")
      .setColor("Purple")
      .setDescription(
        "**إدارة VPS:**\n" +
        "`/vps-plans`\n" +
        "`/adduser`\n" +
        "`/deluser`\n" +
        "`/lock`\n" +
        "`/unlock`"
      );
  }

  if (interaction.values[0] === "public") {
    embed = new EmbedBuilder()
      .setTitle("🌍 Public Commands")
      .setColor("Blue")
      .setDescription(
        "**متاح للجميع:**\n" +
        "`/help`\n" +
        "`/ping`\n" +
        "`/userinfo`\n" +
        "`/serverinfo`"
      );
  }

  if (interaction.values[0] === "owner") {
    embed = new EmbedBuilder()
      .setTitle("👑 Owner Commands")
      .setColor("Red")
      .setDescription(
        "**Owner Only:**\n" +
        "`/setup-ticket`\n" +
        "`/adduser`\n" +
        "`/deluser`\n" +
        "`/auto-cleanup`\n" +
        "`/vps-info`"
      );
  }

  await interaction.update({
    embeds: [embed],
    components: []
  });
};