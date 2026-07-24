import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MessageFlags, User, Role , AutocompleteInteraction, Guild, GuildMember , PermissionFlagsBits, InteractionContextType} from "discord.js";
import { Command } from "../../types";
import { Bot } from "../../types";
import { GradesModel } from "../../db/models/grades";
import { fetchMember } from "../../utils/fetchMember";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("remove-rank")
    .setDescription("Remove a rank from the database.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .addStringOption((option) => option
        .setName("rank")
        .setDescription("The rank to remove.")
        .setRequired(true)
        .setAutocomplete(true) 
    ) as SlashCommandBuilder,


    autocomplete: async (interaction: AutocompleteInteraction, client: Bot) => {
        const focusedValue = interaction.options.getFocused();
        const grades = await client.db.tables.grades.getAll();
        const gradeIds = new Set(grades.map((grade) => grade.data.role_id));
        const guild = client.guilds.cache.get(interaction.guildId ?? "");

       
        const gradeRoles = guild?.roles.cache
            .filter((role) => gradeIds.has(role.id))
            .map((role) => ({ id: role.id, name: role.name })) ?? [];

        if (gradeRoles.length === 0) {
            await interaction.respond([{ name: "No grades found", value: "no_grades" }]);
            return;
        }

        const filtered = gradeRoles
            .filter((role) => role.name.toLowerCase().startsWith(focusedValue.toLowerCase()))
            .slice(0, 25);

        await interaction.respond(
            filtered.map((role) => ({ name: role.name, value: role.id }))
        );
    },

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {

    const sent = await interaction.deferReply();
    const gradeId = interaction.options.getString("rank") as string
    const grade = interaction.guild?.roles.cache.get(gradeId) as Role;



    const userDb = await bot.db.tables.users.getAll();
    const gradeDb = await bot.db.tables.grades.getAll();

    let memberDemotion = [];
    for (const user of userDb) {
      if (user.data.current_grade === gradeId) {
        
        const member = await fetchMember(interaction.guild as Guild, user.data.id);

        const role = interaction.guild?.roles.cache.get(user.data.current_grade) as Role;
        const currentGrade = gradeDb.find((grade) => grade.data.role_id === user.data.current_grade) as unknown as GradesModel;
        const previousGrade = gradeDb.find((grade) => grade.data.level === currentGrade.data.level - 1) 
        if (!previousGrade) {
          await member.roles.remove(role);
          user.data.current_grade = "";
          await user.save();
          memberDemotion.push({user : user, grade : null});
          continue;
        }

        const previousGradeRole = interaction.guild?.roles.cache.get(previousGrade.data.role_id) as Role;
        await member.roles.remove(role);
        await member.roles.add(previousGradeRole);
        user.data.current_grade = previousGrade.data.role_id;
        await user.save();
        memberDemotion.push({user : user, grade : previousGrade});
      }
    }


    await bot.db.tables.grades.delete(gradeId);
    const memberDemotionDesciption = memberDemotion
      .map((member) => {
        if (member.grade) {
          return `<@${member.user.data.id}> to <@&${member.grade.data.role_id}>`}
        else {
          return `<@${member.user.data.id}> to no grade`;
        }
      }).join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Grade removed")
      .setColor("#1840da")
      .setDescription(`✅ ${grade.name} removed !\n\n${memberDemotionDesciption}`);
    await interaction.editReply({ embeds: [embed] });
    
  },
};

export default command;
