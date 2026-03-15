import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags } from "discord.js";
import { Command } from "../types";
import { Bot } from "../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Reply the bot latency"),

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply({flags : MessageFlags.Ephemeral});

    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;

    const apiLatency = Math.round(interaction.client.ws.ping);
    
    await interaction.editReply({ content : `🤖 Bot latency : ${botLatency}ms\n📡 API latency ${apiLatency}ms` });
  },
};

export default command;
