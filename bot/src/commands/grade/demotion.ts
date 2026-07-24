import { SlashCommandBuilder, ChatInputCommandInteraction,User,GuildMember,Role, EmbedBuilder, MessageFlags, PermissionFlagsBits,InteractionContextType } from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";


const command: Command = {
  data: new SlashCommandBuilder()
    .setName("demote")
    .setDescription("Demote a member.")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user you want to demote.")
        .setRequired(true)
    )
    .addRoleOption((option) => option
        .setName("rank")
        .setDescription("The rank you want to demote the user to.")
        .setRequired(true)
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const user = interaction.options.getUser("user") as User;
    const role = interaction.options.getRole("rank") as Role;


    const userData = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    if (!userData.data.in_faction) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted in the faction !` });
      return;
    }

    const member = interaction.guild?.members.cache.get(user.id) as GuildMember;
    const gradeData = await bot.db.tables.grades.getById(userData.data.current_grade);
    const updatedGradeData = await bot.db.tables.grades.getById(role.id);

    if (!gradeData) {
      await interaction.editReply({ content : `❌ Grade not found !` });
      return;
    }
    if (!updatedGradeData) {
      await interaction.editReply({ content : `❌ Updated grade not found !` });
      return;
    }
    if (gradeData.data.level <= updatedGradeData.data.level) {
      await interaction.editReply({ content : `❌ You can only demote to a lower grade !` });
      return;
    }
    

    const gradeRole = interaction.guild?.roles.cache.get(userData.data.current_grade) as Role;

    const oldGrade = userData.data.current_grade;
    userData.data.current_grade = role.id;
    userData.data.xp = 0;
    await userData.save();

    await member.roles.remove(gradeRole);
    await member.roles.add(role);
    
    await bot.log.logDemotion(user.id, oldGrade, role.id);
    await interaction.editReply({ content : `✅ ${user.globalName} demoted !` });

      

  },
};

export default command;
