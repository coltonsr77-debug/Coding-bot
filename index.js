require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits, REST, Routes, Events } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.commands = new Collection();
const commands = [];

// Load all commands from /commands folder
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
}

// Register slash commands globally
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("🛠 Registering slash commands...");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log("✅ Commands registered successfully.");
  } catch (error) {
    console.error("❌ Failed to register commands:", error);
  }
})();

// Event: Bot Ready
client.once(Events.ClientReady, readyClient => {
  console.log(`🤖 Logged in as ${readyClient.user.tag}`);
  console.log(`🌍 Serving in ${client.guilds.cache.size} servers.`);
});

// Event: Command Interaction
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "⚠️ There was an error executing this command.", ephemeral: true });
  }
});

// Login bot
client.login(process.env.DISCORD_TOKEN);
