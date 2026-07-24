import { SlashCommandBuilder, ChatInputCommandInteraction,User,GuildMember,Role, EmbedBuilder, MessageFlags , PermissionFlagsBits,InteractionContextType } from "discord.js";
import { Command } from "../../types"; 
import { Bot } from "../../types";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("promote")
    .setDescription("Promote a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to promote.")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;


    const userData = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    if (userData.data.rank_lock_grade_id) {
      await interaction.editReply({ content : `❌ ${user.globalName} is rank locked !` });
      return;
    }

    if (!userData.data.in_faction) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted in the faction !` });
      return;
    }

    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;
    const gradeData = await bot.db.tables.grades.getById(userData.data.current_grade);


    let nextGrade;
    if (!gradeData) {
      nextGrade = await bot.db.tables.grades.nextGrade(-1);
    }
    else {
      nextGrade = await bot.db.tables.grades.nextGrade(gradeData.data.level);
    }
    

    if (!nextGrade) {
      await interaction.editReply({ content : `❌ ${user.globalName} is already at the maximum grade or member doesn't have a grade and no grade is set with level 0 !` });
      return;
    }

    if (userData.data.xp >= nextGrade.xp_requirements){
        if (gradeData) {
          const role = interaction.guild?.roles.cache.get(userData.data.current_grade) as Role;
          await member.roles.remove(role);
        }     

        const oldGrade = userData.data.current_grade;
        userData.data.current_grade = nextGrade.role_id;
        userData.data.xp = 0;
        await userData.save();

        const newRole = interaction.guild?.roles.cache.get(nextGrade.role_id) as Role;
        await member.roles.add(newRole);
        
        await bot.log.logPromotion(user.id, oldGrade, nextGrade.role_id);
        await interaction.editReply({ content : `✅ ${user.globalName} promoted !` });

        
    }
    else{
        await interaction.editReply({ content : `❌ ${user.globalName} doesn't have enough xp !` });
    }

  },
};

export default command;
