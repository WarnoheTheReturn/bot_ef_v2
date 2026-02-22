import { client } from "./client";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import * as dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
if (!token) {
  throw new Error("Missing bot token");
}

(async () => {
  await loadCommands(client);
  await loadEvents(client);
  await client.login(token);
})();
