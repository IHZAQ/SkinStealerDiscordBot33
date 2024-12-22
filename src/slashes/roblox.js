import noblox from "noblox.js"
import search from "../api/search.js"
import {
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js"
import { promisify } from "util"
import player from "./roblox/player.js"
import favgame from "./roblox/favgame.js"
import oldnames from "./roblox/oldnames.js"
const wait = promisify(setTimeout)
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
    .setIntegrationTypes([0,1]),
  async execute(interact, { config, embErr }) {
    const command = interact.options.getSubcommand()
    switch (command) {
      case "player":
        await player(interact, noblox, EmbedBuilder, wait, config, embErr)
        break;
      case "favgame":
        await favgame(interact, noblox, EmbedBuilder, wait, config, embErr)
        break;
      case "oldnames":
        await oldnames(interact, noblox, EmbedBuilder, wait, config, embErr)
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let result = await search(focusedValue)
    try {
     await interaction.respond(result);
    } catch (err) {
      console.log(`Cannot send the username list to ${interaction.user.username}`)
    }
  },
}