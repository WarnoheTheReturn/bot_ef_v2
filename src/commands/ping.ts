import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Command } from "../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Répond avec Pong et donne la latence du bot !"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply("🏓 Pong !");
  },
};

export default command;
