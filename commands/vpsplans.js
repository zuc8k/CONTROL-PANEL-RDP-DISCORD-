const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vps-plans")
    .setDescription("Show VPS plans"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("💻 VPS Plans")
      .setColor("Blue")
      .setDescription(`
🟢 **3 Days** — **50 EGP**
🔵 **7 Days** — **100 EGP**
🟣 **30 Days** — **350 EGP**

⚡ Fast • 🔐 Secure • 🌍 Public IP
      `);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("buy_3")
        .setLabel("🟢 Subscribe 3 Days")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("buy_7")
        .setLabel("🔵 Subscribe 7 Days")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("buy_30")
        .setLabel("🟣 Subscribe 30 Days")
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};