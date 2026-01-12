const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fs = require("fs");
const { token } = require("./config.json");

// 🔥 Automation (Expire + Warn)
const startScheduler = require("./utils/scheduler");

// 🌍 Public IP Watcher
const startIPWatcher = require("./utils/ipWatcher");

// 🎟 Ticket handlers
const ticketButtons = require("./tickets/ticketButtons");
const ticketCloseModal = require("./tickets/ticketCloseModal");
const ticketRating = require("./tickets/ticketRating");
const ticketConfig = require("./utils/ticketConfig");

// 📖 Help menu handler
const helpMenu = require("./tickets/helpMenu");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// ================= LOAD COMMANDS =================
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ================= BOT READY =================
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // ⏱ Auto-Expire + Auto-Warn
  startScheduler(client);
  console.log("⏱ Automation Scheduler started");

  // 🌍 Public IP Watcher
  startIPWatcher(client);
  console.log("🌍 Public IP Watcher started");
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async interaction => {

  /* ========= SLASH COMMANDS ========= */
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: "❌ Error executing command" });
      } else {
        await interaction.reply({
          content: "❌ Error executing command",
          ephemeral: true
        });
      }
    }
  }

  /* ========= HELP MENU (SELECT) ========= */
  if (interaction.isStringSelectMenu()) {
    await helpMenu(interaction);
  }

  /* ========= BUTTONS ========= */
  if (interaction.isButton()) {
    // Ticket system buttons (open / claim / transfer)
    await ticketButtons(interaction);

    // Rating buttons ⭐
    await ticketRating(interaction);

    // Close → show modal
    if (interaction.customId === "ticket_close") {
      await ticketCloseModal(interaction);
    }
  }

  /* ========= CLOSE TICKET MODAL ========= */
  if (interaction.isModalSubmit() && interaction.customId === "close_modal") {
    const reason = interaction.fields.getTextInputValue("reason");
    const cfg = ticketConfig.load();

    const logChannel = interaction.guild.channels.cache.get(cfg.logChannel);

    // 🔒 Log Embed للإغلاق
    if (logChannel) {
      const closeEmbed = new EmbedBuilder()
        .setTitle("🔒 Ticket Closed")
        .setColor("Red")
        .addFields(
          { name: "👤 Closed By", value: `${interaction.user}`, inline: true },
          { name: "📄 Ticket", value: interaction.channel.name, inline: true },
          { name: "📝 Reason", value: reason }
        )
        .setTimestamp();

      logChannel.send({ embeds: [closeEmbed] });
    }

    // ⭐ Rating Panel
    const ratingEmbed = new EmbedBuilder()
      .setTitle("⭐ Rate Our Service")
      .setDescription("من فضلك قيّم الخدمة")
      .setColor("Gold");

    const ratingRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("rate_1").setLabel("⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_2").setLabel("⭐⭐").setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("rate_3").setLabel("⭐⭐⭐").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("rate_4").setLabel("⭐⭐⭐⭐").setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("rate_5").setLabel("⭐⭐⭐⭐⭐").setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
      embeds: [ratingEmbed],
      components: [ratingRow]
    });

    // ⏳ حذف التكت بعد مهلة للتقييم
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 15000); // 15 ثانية
  }

});

// ================= LOGIN =================
client.login(token);