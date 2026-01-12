const { SlashCommandBuilder } = require("discord.js");
const i18n = require("../utils/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lang")
    .setDescription("Change bot language")
    .addStringOption(o =>
      o.setName("language")
        .setDescription("Choose language")
        .setRequired(true)
        .addChoices(
          { name: "Arabic 🇪🇬", value: "ar" },
          { name: "English 🇺🇸", value: "en" }
        )
    ),

  async execute(interaction) {
    const lang = interaction.options.getString("language");
    i18n.setUserLang(interaction.user.id, lang);

    await interaction.reply({
      ephemeral: true,
      content:
        lang === "ar"
          ? i18n.t(interaction.user.id, "lang.changed.ar")
          : i18n.t(interaction.user.id, "lang.changed.en")
    });
  }
};