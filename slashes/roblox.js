const { norme, colors } = require("../utils/config")
const noblox = require("noblox.js")
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const wait = require("util").promisify(setTimeout);
const search = require("./../api/search.js");
function f(num) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'K+';
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  } else if (num < 900) {
    return num;
  }
}
module.exports = {
  cooldown: 18,
  usage: {
    id: "941593557490335744",
    desc: `</roblox player:941593557490335744> - Fetch Roblox User Information\n` +
      `</roblox oldnames:941593557490335744> - Fetch Roblox User Old Names\n` +
      `</roblox favgame:941593557490335744> - Fetch Roblox User Favorite Games (including name and links)`
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
  async execute(interact) {
    if (interact.options.getSubcommand() === 'player') {
      const player = require("./roblox/player")
      player(interact, noblox, EmbedBuilder, wait, f)
    }
    if (interact.options.getSubcommand() === 'favgame') {
      const favgame = require("./roblox/favgame")
      favgame(interact, noblox, EmbedBuilder, wait)
    }
    if (interact.options.getSubcommand() === 'oldnames') {
      const oldnames = require("./roblox/oldnames")
      oldnames(interact, noblox, EmbedBuilder, wait)
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    let result = await search(focusedValue)
    await interaction.respond(result);
  },
}