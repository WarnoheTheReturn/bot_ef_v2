import { Client, GatewayIntentBits, Collection } from "discord.js";
import { Command } from "./types";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


(client as any).commands = new Collection<string, Command>();
