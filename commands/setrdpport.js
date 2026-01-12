const { SlashCommandBuilder } = require("discord.js");
const run = require("../utils/exec");
const perm = require("../utils/permission");
const log = require("../utils/logger");
const fs = require("fs");
const path = require("path");

const rdpFile = path.join(__dirname, "../data/rdp.json");

function updateRDPPort(port) {
  const data = fs.existsSync(rdpFile)
    ? JSON.parse(fs.readFileSync(rdpFile, "utf8"))
    : { port: 2004, address: null };

  data.port = port;
  data.address = null; // هيتحدّث تلقائي بعد الريستارت
  fs.writeFileSync(rdpFile, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setrdpport")
    .setDescription("Change RDP port & auto restart (Owner only)")
    .addIntegerOption(opt =>
      opt
        .setName("port")
        .setDescription("New RDP port (1024-65535)")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!perm.isOwner(interaction.user.id)) {
      return interaction.reply({
        content: "⛔ Owner only.",
        ephemeral: true
      });
    }

    const port = interaction.options.getInteger("port");

    if (port < 1024 || port > 65535) {
      return interaction.reply({
        content: "❌ Invalid port range (1024-65535).",
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      // 🧠 تغيير بورت RDP في الريجستري
      await run(
        `reg add "HKLM\\System\\CurrentControlSet\\Control\\Terminal Server\\WinStations\\RDP-Tcp" /v PortNumber /t REG_DWORD /d ${port} /f`
      );

      // 🔥 فتح البورت في الفايروول
      await run(
        `netsh advfirewall firewall add rule name="RDP-${port}" dir=in action=allow protocol=TCP localport=${port}`
      );

      // 💾 تحديث ملف RDP
      updateRDPPort(port);

      log(interaction, "SET_RDP_PORT", "SUCCESS", `Port: ${port}`);

      // 🔄 Restart تلقائي بعد 10 ثواني
      await interaction.editReply(
        `✅ **RDP Port Changed Successfully**\n` +
        `🖥 New Port: \`${port}\`\n` +
        `🔄 Server will restart in **10 seconds**...`
      );

      setTimeout(async () => {
        await run("shutdown /r /t 0");
      }, 10000);

    } catch (e) {
      log(interaction, "SET_RDP_PORT", "FAILED", e.toString());

      await interaction.editReply(
        `❌ Error changing RDP port:\n\`\`\`${e}\`\`\``
      );
    }
  }
};