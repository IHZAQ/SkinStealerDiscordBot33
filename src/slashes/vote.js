import {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"

export default {
  category: "General", 
  usage: {
    desc: "List of Links to vote our bot on bot list providers"
  },
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote and Upvote this bot. May support the development"),
  async execute(interact, client) {
    const { norme, colors } = client.config
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