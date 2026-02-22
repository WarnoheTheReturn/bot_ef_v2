import { Client } from "discord.js";
import { Event } from "../types";

const event: Event = {
  name: "ready",
  once: true,
  async execute(client: Client) {
    console.log(`✅ Bot connected as ${client.user?.tag}`);
  },
};

export default event;
