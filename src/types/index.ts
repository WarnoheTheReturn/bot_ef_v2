import { SlashCommandBuilder, ChatInputCommandInteraction, Client, Collection } from "discord.js";
import {Database} from '../db/index';

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction, client: Bot) => Promise<void>;
}

export interface Event {
  name: string;
  once?: boolean;
  execute: (...args: any[]) => Promise<void>;
}

export class Bot extends Client {
  public commands : Collection<string, Command> = new Collection();
  public db: Database = new Database();
}