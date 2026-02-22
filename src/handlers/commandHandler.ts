import { Client, Collection } from "discord.js";
import { Command } from "../types";
import * as path from "path";
import * as fs from "fs";

export async function loadCommands(client: Client): Promise<void> {
  const commands = new Collection<string, Command>();
  const commandsPath = path.join(__dirname, "..", "commands");

  if (!fs.existsSync(commandsPath)) {
    console.log("⚠️ Command folder does not exist");
    fs.mkdirSync(commandsPath);
  }

  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));

  if (files.length === 0) {
    console.log("⚠️ No commands were found");
    (client as any).commands = commands; 
    return;
  }



  for (const file of files) {
    const filePath = path.join(commandsPath, file);
    try {
      const command: Command = require(filePath).default;
      
        
      if (command && command.data && typeof command.execute === "function") {
        commands.set(command.data.name, command);
        console.log(`✅ Command loaded : ${command.data.name}`);
      } else {
        console.log(`❌ Command ${file} is not in the correct format.`);
      }
    } catch (error) {
      console.log(`❌ [ERREUR] Unable to load the command ${file} :`, error);
    }
  }

  (client as any).commands = commands;
  console.log(`ℹ️ ${commands.size} commands loaded !`);
}
