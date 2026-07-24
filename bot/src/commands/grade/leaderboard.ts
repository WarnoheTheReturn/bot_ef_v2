import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User, Role ,GuildMember, InteractionContextType} from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { GradesModel } from "../../db/models/grades";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the faction's leaderboard.")
    .setContexts(InteractionContextType.Guild) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    const usersDatas = await bot.db.tables.users.getAll(); 
    const allGrade = await bot.db.tables.grades.getAll();
    const userGrades = usersDatas.map((user) => {
      const grade = allGrade.find((grade) => grade.data.role_id === user.data.current_grade) as unknown as GradesModel;
      return { ...user, grade: { ...grade } };
    });
    const usersGradeSort = userGrades.sort((a, b) => b.grade.data.level - a.grade.data.level || b.data.xp - a.data.xp);
    if (usersGradeSort.length === 0) {
      await interaction.editReply({ content : `❌ No user is registered !` });
      return;
    };
    let count = 0;
    const embed = new EmbedBuilder()
      .setTitle("Leaderboard")
      .setColor("#1840da");
    for (const userData of usersGradeSort) {
        if (count >= 24) {
          break;
        }
        console.log(userData);
        const member = await interaction.guild?.members.fetch(userData.data.id) ;
        console.log(member);
        if (!member) {
          continue;
        }
        if (userData.data.in_faction) {
            embed.addFields({ name:  member.user.username, value: `<@&${userData.grade.data.role_id}> : Level : ${userData.grade.data.level} | XP : ${userData.data.xp}` });
        }
        else {
            embed.addFields({ name: member.user.username, value: `Not enlisted` });
        }
        count++;
    }
    embed.setFooter({ text: `Page ${Math.floor(count / 24) + 1}/${Math.ceil(count / 24)}` });
    await interaction.editReply({ embeds: [embed] });

  


    
  },
};

export default command;
