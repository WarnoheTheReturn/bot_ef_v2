import { Events, BaseInteraction, ChatInputCommandInteraction } from 'discord.js';
import { Event, Command, Bot } from '../types';

const event: Event = {
  name: Events.InteractionCreate, 
  once: false,
  
  async execute(interaction: BaseInteraction, client: Bot) {
    
    if (!interaction.isChatInputCommand()) return;

    const commandInteraction = interaction as ChatInputCommandInteraction;

    const command: Command | undefined = client.commands.get(commandInteraction.commandName);

    if (!command) {
      console.error(`⚠️ Command /${commandInteraction.commandName} was not found.`);
      return;
    }

    try {
      await command.execute(commandInteraction, client);
      console.log(`ℹ️ /${commandInteraction.commandName} executed by ${interaction.user.globalName}`)
    } catch (error) {
      console.error(`❌ Erreur with the execution of the command /${commandInteraction.commandName} :`, error);
      
      if (commandInteraction.replied || commandInteraction.deferred) {
        await commandInteraction.followUp({ content: ' Erreur with the execution of the command  !', ephemeral: true });
      } else {
        await commandInteraction.reply({ content: ' Erreur with the execution of the command  !', ephemeral: true });
      }
    }
  },
};

export default event;
