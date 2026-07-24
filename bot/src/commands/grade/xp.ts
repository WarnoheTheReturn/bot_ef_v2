import { SlashCommandBuilder, ChatInputCommandInteraction, User,EmbedBuilder, MessageFlags , PermissionFlagsBits, InteractionContextType } from "discord.js";
import { Command , xpType} from "../../types";
import { Bot } from "../../types";
import { UsersModel } from "../../db/models/users"

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("xp")
    .setDescription("View or change a user’s xp.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user that you’d like to view / edit.")
        .setRequired(true)
    )
    .addStringOption((option) => option
        .setName("action")
        .setDescription("add / remove / set")
        .setRequired(true)
        .addChoices(
            { name: "add", value: "add" },
            { name: "remove", value: "remove" },
            { name: "set", value: "set" }
        )
    ) 
    .addNumberOption((option) => option
        .setName("value")
        .setDescription("Amount of xp.")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const action = interaction.options.getString("action") as xpType;
    const amount = interaction.options.getNumber("value") as number;

    const userData : UsersModel | null = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    const previous_xp = userData.data.xp;

    if (action === "add") {
      userData.data.xp += amount;
    }
    else if (action === "remove") {
      userData.data.xp -= amount;
    }
    else if (action === "set") {
      userData.data.xp = amount;
    }
    await userData.save();

    const description = `<@${user.id}> ${action === "add" ? "was added by +" : action === "remove" ? "was removed by -" : "was set to "}${amount} XP`;


    await bot.log.logXp(action,description);

    
    await interaction.editReply({ content : `✅ ${user.globalName} updated from ${previous_xp} to ${userData.data.xp} !` });
    
  },
};

export default command;
