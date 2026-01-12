const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/actions.log");

module.exports = (interaction, action, status, details = "") => {
  const time = new Date().toLocaleString();
  const user = `${interaction.user.tag} (${interaction.user.id})`;
  const command = interaction.commandName;

  const log = `[${time}] [${status}] [${action}] [${command}] [${user}] ${details}\n`;

  fs.appendFileSync(logFile, log);
};