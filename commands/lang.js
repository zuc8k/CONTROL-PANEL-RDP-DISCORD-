const { SlashCommandBuilder } = require("discord.js");
const langStore = require("../utils/lang");

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

    langStore.set(interaction.user.id, lang);

    await interaction.reply({
      ephemeral: true,
      content:
        lang === "ar"
          ? "✅ تم تغيير اللغة إلى العربية"
          : "✅ Language changed to English"
    });
  }
};