import { REST, Routes } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;


if (!token || !guildId || !clientId) {
  throw new Error("Config file missing some values");
}

const commands = [];
const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"));


for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file)).default;
  if (command && command.data) {
    commands.push(command.data.toJSON());
  }
}


const rest = new REST({ version: "10" }).setToken(token);


(async () => {
  try {
    console.log(`⏳ Start of the deployment of ${commands.length} commands.`);

    const data: any = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`✅ ${data.length} commands were loaded.`);
  } catch (error) {
    console.error("❌ Error deploying commands :", error);
  }
})();
