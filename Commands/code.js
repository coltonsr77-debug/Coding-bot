// commands/code.js
const { SlashCommandBuilder } = require("discord.js");
const vm = require("node:vm");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("code")
    .setDescription("Run small JavaScript snippets safely.")
    .addStringOption(option =>
      option.setName("input")
        .setDescription("Your JavaScript code")
        .setRequired(true)
    ),
  async execute(interaction) {
    const code = interaction.options.getString("input");

    try {
      const result = vm.runInNewContext(code, {}, { timeout: 1000 });
      await interaction.reply(`✅ **Output:**\n\`\`\`${result}\`\`\``);
    } catch (error) {
      await interaction.reply(`❌ **Error:**\n\`\`\`${error.message}\`\`\``);
    }
  },
};
