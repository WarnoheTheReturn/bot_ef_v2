import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command } from "../types";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Reply the bot latency"),

  async execute(interaction: ChatInputCommandInteraction) {
    const sent = await interaction.deferReply();

    const botLatency = sent.createdTimestamp - interaction.createdTimestamp;

    const apiLatency = Math.round(interaction.client.ws.ping);

    const pingEmbed = new EmbedBuilder()
      .setColor(botLatency < 200 ? 0x00FF00 : botLatency < 500 ? 0xFFFF00 : 0xFF0000) 
      .setTitle("Latency")
      .addFields(
        { name: "🤖 Bot latency", value: `\`${botLatency}ms\``, inline: true },
        { name: "📡 API latency", value: `\`${apiLatency}ms\``, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [pingEmbed] });
  },
};

export default command;
