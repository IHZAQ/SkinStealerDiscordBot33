import {
   SlashCommandBuilder
} from "discord.js"
import player from "./hivemc/player.js"
import leaderboard from "./hivemc/leaderboard.js"
import { addChoice } from "../data/hivecat.js"
export default {
   cooldown: 14,
   category: "Statistics",
   usage: {
      player: "Shows HiveMC players' statistics, including statistics for every game"
   },
   data: new SlashCommandBuilder()
      .setName("hivemc")
      .setDescription("HiveMC")
      .addSubcommand(command =>
         command.setName("player")
            .setDescription("Shows HiveMC players' statistics, including statistics for every game")
            .addStringOption(option =>
               option.setName("username")
                  .setDescription("XBOX Gamertag here")
                  .setRequired(true))
            .addStringOption(option => 
               option.setName("game")
                  .setDescription("Choosen game")
                  .addChoices(addChoice)
            )
      )
      .addSubcommandGroup(command =>
         command.setName("leaderboard")
            .setDescription("Shows HiveMC leaderboard for every game")
            .addSubcommand(command =>
               command.setName("alltime")
                  .setDescription("All Time Leaderboard")
                  .addStringOption(option =>
                     option.setName("game")
                        .setDescription("Choosen game")
                        .addChoices(addChoice)
                        .setRequired(true)
                  ))
            .addSubcommand(command =>
               command.setName("monthly")
                  .setDescription("Monthly Leaderboard")
                  .addStringOption(option =>
                     option.setName("game")
                        .setDescription("Choosen game")
                        .addChoices(addChoice)
                        .setRequired(true)
                  )
                  .addStringOption(option =>
                     option.setName("month")
                        .setDescription("A month of leaderboard")
                        .addChoices(
                           { name: "January", value: "1" },
                           { name: "February", value: "2" },
                           { name: "March", value: "3" },
                           { name: "April", value: "4" },
                           { name: "May", value: "5" },
                           { name: "June", value: "6" },
                           { name: "July", value: "7" },
                           { name: "August", value: "8" },
                           { name: "September", value: "9" },
                           { name: "October", value: "10" },
                           { name: "November", value: "11" },
                           { name: "December", value: "12" }
                        )
                        .setRequired(true)
                  )
                  .addStringOption(option =>
                     option.setName("year")
                        .setDescription("A year of leaderboard")
                        .addChoices(
                           { name: "2024", value: "2024" },
                           { name: "2025", value: "2025" }
                        )
                        .setRequired(true)
                  ))
            .addSubcommand(command =>
               command.setName("season")
                  .setDescription("Season Leaderboard")
                  .addStringOption(option =>
                     option.setName("season")
                        .setDescription("Seasons")
                        .addChoices(
                           { name: "Season 1", value: "1" },
                           { name: "Season 2", value: "2" }
                        )
                        .setRequired(true)
                  )
                  .addStringOption(option =>
                     option.setName("game")
                        .setDescription("Choosen game")
                        .addChoices(
                           { name: 'Bedwars 🛏️', value: 'bed' }
                        )
                        .setRequired(true)
                  ))
      )
      .setIntegrationTypes([0, 1]),
   execute: async (interaction, client) => {
      const subcommand = interaction.options.getSubcommand()
      if (subcommand === "player") {
         await player.execute(interaction, client)
      }
      if (["alltime", "monthly", "season"].includes(subcommand)) {
         await leaderboard.execute(interaction, client)
      }
   },
   async selectmenu(interaction, client) {
      const [, , , subcommand] = interaction.customId.split("-")
      switch (subcommand) {
         case "leaderboard":
            await leaderboard.selectmenu(interaction, client)
            break;
         default:
            await player.selectmenu(interaction, client);
      }
   }
}