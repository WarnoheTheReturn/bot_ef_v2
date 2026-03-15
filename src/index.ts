import { client } from "./client";
import { loadCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";
import { config } from './config';


(async () => {
  await loadCommands(client);
  await loadEvents(client);
  await client.login(config.discord.token);
})();
