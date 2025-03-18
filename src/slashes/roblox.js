import { search } from "../api/robloxuser.js"
import {
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js"
import player from "./roblox/player.js"
import favgame from "./roblox/favgame.js"
import oldnames from "./roblox/oldnames.js"
export default {
  cooldown: 18,
  category: "Roblox Tools",
  usage: {
    player: `Fetch Roblox User Information`,
    oldnames: `Fetch Roblox User Old Names`,
    favgame: `Fetch Roblox User Favorite Games (including name and links)`
  },
  data: new SlashCommandBuilder()
    .setName("roblox")
    .setDescription("Get Roblox Profile from a users.")
    .addSubcommand(command =>
      command
        .setName('player')
        .setDescription('For Roblox User use.')
        .addStringOption(option =>
          option.setName("username")
            .setDescription("Username of Roblox Users.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(command =>
      command
        .setName("oldnames")
        .setDescription("Show users's names history")
        .addStringOption(option =>
          option.setName("username")
            .setDescription("Username of Roblox users")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand(command =>
      command
        .setName("favgame")
        .setDescription("Show users favourite game(useless)")
        .addStringOption(option =>
          option.setName("username")
            .setDescription("Username of Roblox users")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .setIntegrationTypes([0, 1]),
  async execute(interact, { config, embErr, checkPerms }) {
    const command = interact.options.getSubcommand()
    switch (command) {
      case "player":
        await player(interact, EmbedBuilder, config, embErr, checkPerms)
        break;
      case "favgame":
        await favgame(interact, EmbedBuilder, config, embErr, checkPerms)
        break;
      case "oldnames":
        await oldnames(interact, EmbedBuilder, config, embErr, checkPerms)
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let result = await search(focusedValue)
    try {
      await interaction.respond(result);
    } catch (err) { }
  },
}