// commands/help.js
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Lists all available commands."),
  async execute(interaction) {
    await interaction.reply("📘 Commands:\n`/ping` - test bot\n`/code` - run code\n`/explain` - explain code");
  },
};
