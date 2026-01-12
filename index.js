const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { token } = require("./config.json");

// 🔥 Automation (Expire + Warn)
const startScheduler = require("./utils/scheduler");

// 🌍 Public IP Watcher
const startIPWatcher = require("./utils/ipWatcher");

// 🎟 Ticket handlers
const ticketButtons = require("./tickets/ticketButtons");
const ticketCloseModal = require("./tickets/ticketCloseModal");
const ticketConfig = require("./utils/ticketConfig");

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

  /* ========= TICKET BUTTONS ========= */
  if (interaction.isButton()) {
    // فتح التكت + Claim + Transfer
    await ticketButtons(interaction);

    // زر Close → يظهر Modal
    if (interaction.customId === "ticket_close") {
      await ticketCloseModal(interaction);
    }
  }

  /* ========= CLOSE TICKET MODAL ========= */
  if (interaction.isModalSubmit() && interaction.customId === "close_modal") {
    const reason = interaction.fields.getTextInputValue("reason");
    const cfg = ticketConfig.load();

    const logChannel = interaction.guild.channels.cache.get(cfg.logChannel);

    // 🧾 Log Embed احترافي
    if (logChannel) {
      const embed = new EmbedBuilder()
        .setTitle("🔒 Ticket Closed")
        .setColor("Red")
        .addFields(
          {
            name: "👤 Closed By",
            value: `${interaction.user}`,
            inline: true
          },
          {
            name: "📄 Ticket Channel",
            value: interaction.channel.name,
            inline: true
          },
          {
            name: "📝 Reason",
            value: reason
          }
        )
        .setTimestamp();

      logChannel.send({ embeds: [embed] });
    }

    await interaction.reply({
      ephemeral: true,
      content: "✅ Ticket closed successfully."
    });

    // ⏳ حذف التكت
    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 3000);
  }

});

// ================= LOGIN =================
client.login(token);