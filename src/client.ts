import { GatewayIntentBits } from "discord.js";
import { Bot } from "./types";

export const client = new Bot({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
