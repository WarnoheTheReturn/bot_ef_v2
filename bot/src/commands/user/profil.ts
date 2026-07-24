import { SlashCommandBuilder, 
  ChatInputCommandInteraction, 
  EmbedBuilder, 
  MessageFlags, 
  User , 
  ContainerBuilder,
  SectionBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  SeparatorBuilder,
  InteractionContextType
} from "discord.js";



import { Command } from "../../types";
import { Bot } from "../../types";
import { UsersModel } from "../../db/models/users"
import { GradesModel } from "../../db/models/grades"
import {robloxProfilPictureURL} from "../../utils/roblox";

const command: Command = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Get info about a specific user.")
    .setContexts(InteractionContextType.Guild)
    .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to retrieve information about.")
    ) as SlashCommandBuilder,

  execute: async (interaction: ChatInputCommandInteraction, bot: Bot) => {
    const sent = await interaction.deferReply();

    let user = interaction.options.getUser("user") as User;
    if (!user) {
      user = interaction.user;
    }

    const userData : UsersModel | null = await bot.db.tables.users.getById(user.id);
    if (!userData) {
      await interaction.editReply({ content : `❌ ${user.globalName} is not enlisted !` });
      return;
    }

    let xp_requirements = "?";
    let next_grade_id = "?";
    const gradeData : GradesModel | null = await bot.db.tables.grades.getById(userData.data.current_grade);
    if (gradeData) {
        const nextGrade = await bot.db.tables.grades.nextGrade(gradeData.data.level);
        xp_requirements = (nextGrade?.xp_requirements)?.toString() || "";
        next_grade_id = nextGrade?.role_id || "";
    }

    const robloxProfilPicture = await robloxProfilPictureURL(userData.data.roblox_id);

    const color = 
      userData.data.black_listed ? 0X000000 : 
      userData.data.is_inactivity ? 0Xd4d100 : 
      userData.data.in_faction ? 0X34b302 : 
      0X575757;

    const statusBadge = 
      userData.data.black_listed ? "**Blacklisted** " : 
      userData.data.is_inactivity ? "**On inactivity**" : 
      userData.data.in_faction ? "**Active**" : 
      "**Not in faction**";

    const enlistDate = `${userData.data.enlistment_date.getDate()}/${
      userData.data.enlistment_date.getMonth() + 1}/${
      userData.data.enlistment_date.getFullYear()}`;

    let extraLines = "";
    if (userData.data.is_inactivity)
      extraLines += `\n> **Inactivity until** : ${userData.data.inactivity_duration}`;
    if (userData.data.rank_lock_grade_id !== null)
      {
        const allRankLockData = await bot.db.tables.logs_rank_lock.getAll();
        const rankLockData = allRankLockData.find(log => log.data.user_id === userData.data.id && log.data.is_removed === false) 
        if (rankLockData) extraLines += `\n> **Rank lock ** : <@&${userData.data.rank_lock_grade_id}> until <t:${rankLockData.data.duration.getTime()}:f> `;
      }

    const container = new ContainerBuilder()
      .setAccentColor(color)
      .addSectionComponents(
        new SectionBuilder()
          .addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
              `## ${user.globalName}'s Profile\n${statusBadge}`
            )
          )
          .setThumbnailAccessory(
            new ThumbnailBuilder()
            .setURL(robloxProfilPicture ?? user.displayAvatarURL())
            .setDescription("Roblox Profil Picture")
          )
      )
      .addSeparatorComponents(new SeparatorBuilder().setSpacing(1))
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          [
            `>  **Grade** : <@&${userData.data.current_grade}>`,
            `>  **XP** : \`${userData.data.xp}${next_grade_id ? `/${xp_requirements}\` — Next: <@&${next_grade_id}>` : "\`"}`,
            `>  **Roblox** : [View profile](https://www.roblox.com/users/${userData.data.roblox_id}/profile)`,
            `>  **Enlisted** : ${enlistDate}`,
            extraLines,
          ].join("\n")
        )
          
      );

    await interaction.editReply({
      components: [container],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};

export default command;
