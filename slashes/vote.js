const { norme, colors } = require("../utils/config")
const {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require("discord.js")

module.exports = {
  cooldown: 3,
  usage: {
    desc: "This command will provided a link\n" +
          "For you to Vote Skin Stealer" +
          "Which really show you supported us",
    id: "939668435959423068"
  },
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote and Upvote this bot. May support the development"),
  async execute(interact) {
    await interact.deferReply({ ephemeral: true })
    const embed = new EmbedBuilder()
      .setTitle("Vote")
      .setDescription("Vote me by clicking this bot list provider below")
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
    const row1 = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
          .setEmoji("<:dbl:1051426332355076096>")
          .setLabel("Discord Bot List")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discordbotlist.com/bots/skin-stealer/upvote"),
        new ButtonBuilder()
          .setEmoji("<:discordbotlab:1051427429173952552>")
          .setLabel("Discord Labs")
          .setStyle(ButtonStyle.Link)
          .setURL("https://bots.discordlabs.org/bot/803524726219079690")
      )
    const row2 = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
          .setEmoji("<:topGG:1051426019233497089>")
          .setLabel("Top.gg")
          .setStyle(ButtonStyle.Link)
          .setURL("https://top.gg/bot/803524726219079690/vote"),
        new ButtonBuilder()
          .setEmoji("<:discordlist:1051763902834294785>")
          .setLabel("Discord List")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discordlist.gg/bot/803524726219079690/vote")
      )
    await interact.editReply({
      embeds: [embed],
      components: [row1, row2],
      ephemeral: true
    })
  }
}