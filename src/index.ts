import { client } from "./client";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
if (!token || !guildId) {
  throw new Error("Missing bot token or guild dev id");
}

(async () => {
  await loadCommands(client);
  await loadEvents(client);
  await client.login(token);
})();
