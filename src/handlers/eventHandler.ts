import { Client } from "discord.js";
import { Event } from "../types";
import * as path from "path";
import * as fs from "fs";

export async function loadEvents(client: Client): Promise<void> {
  const eventsPath = path.join(__dirname, "..", "events");
  let loadedEvents = 0;

  if (!fs.existsSync(eventsPath)) {
    console.log("⚠️ Events folder does not exist");
    fs.mkdirSync(eventsPath);
  }

  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

  if (files.length === 0) {
    console.log("⚠️ No events were found.");
    return;
  }

  for (const file of files) {
    const filePath = path.join(eventsPath, file);
    try {
      const event: Event = require(filePath).default;

      if (event && event.name && typeof event.execute === "function") {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        loadedEvents++;
        console.log(`✅ Event loaded : ${event.name}`);
      } else {
        console.log(`❌ Event ${file} is not in the correct format.`);
      }
    } catch (error) {
      console.log(`❌ [ERREUR] Unable to load the event ${file} :`, error);
    }
  }

  console.log(`ℹ️ ${loadedEvents} events loaded !`);
}
