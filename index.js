const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const { token } = require("./config.json");

// 🔥 Automation Scheduler
const startScheduler = require("./utils/scheduler");

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

  // 🔥 يبدأ Auto-Expire / Auto-Disable
  startScheduler();
  console.log("⏱ Automation Scheduler started");
});

// ================= INTERACTIONS =================
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: "❌ Error executing command"
      });
    } else {
      await interaction.reply({
        content: "❌ Error executing command",
        ephemeral: true
      });
    }
  }
});

// ================= LOGIN =================
client.login(token);