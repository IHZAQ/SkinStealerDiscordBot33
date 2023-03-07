const noblox = require("noblox.js")
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const wait = require("util").promisify(setTimeout);
const search = require("../api/search.js");
module.exports = {
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
    ),
  async execute(interact, { config }) {
    if (interact.options.getSubcommand() === 'player') {
      const player = require("./roblox/player")
      player(interact, noblox, EmbedBuilder, wait, config)
    }
    if (interact.options.getSubcommand() === 'favgame') {
      const favgame = require("./roblox/favgame")
      favgame(interact, noblox, EmbedBuilder, wait, config)
    }
    if (interact.options.getSubcommand() === 'oldnames') {
      const oldnames = require("./roblox/oldnames")
      oldnames(interact, noblox, EmbedBuilder, wait, config)
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let result = await search(focusedValue)
    await interaction.respond(result);
  },
}