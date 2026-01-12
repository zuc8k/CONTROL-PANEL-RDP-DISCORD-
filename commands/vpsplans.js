const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const ticketConfig = require("../utils/ticketConfig");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vps-plans")
    .setDescription("Show VPS plans & open ticket"),

  async execute(interaction) {
    const cfg = ticketConfig.load();

    const embed = new EmbedBuilder()
      .setTitle("💻 VPS Plans")
      .setColor("Blue")
      .setDescription(`
🟢 **3 Days** — **50 EGP**
🔵 **7 Days** — **100 EGP**
🟣 **30 Days** — **350 EGP**

⚡ Fast • 🔐 Secure • 🌍 Public IP  
📌 Click the button below to subscribe
      `)
      .setImage(cfg.panelImage || null)
      .setFooter({ text: "VPS Sales System" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_open")
        .setLabel("🎟 Subscribe / Open Ticket")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};