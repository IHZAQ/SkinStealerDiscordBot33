import {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"
import emoji from "../data/emoji.js"

export default {
  category: "General",
  usage: {
    desc: "List of Links to vote our bot on bot list providers"
  },
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Vote and Upvote this bot. May support the development")
    .setIntegrationTypes([0, 1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    await interact.deferReply({ flags: 64 })
    const embed = new EmbedBuilder()
      .setTitle("Vote")
      .setDescription("Vote me by clicking this bot list provider below")
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
    const row1 = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
          .setEmoji(emoji("dbl"))
          .setLabel("Discord Bot List")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discordbotlist.com/bots/skin-stealer/upvote"),
        new ButtonBuilder()
          .setEmoji(emoji("discordbotlab"))
          .setLabel("Discord Labs")
          .setStyle(ButtonStyle.Link)
          .setURL("https://bots.discordlabs.org/bot/803524726219079690")
      )
    const row2 = new ActionRowBuilder()
      .setComponents(
        new ButtonBuilder()
          .setEmoji(emoji("topGG"))
          .setLabel("Top.gg")
          .setStyle(ButtonStyle.Link)
          .setURL("https://top.gg/bot/803524726219079690/vote"),
        new ButtonBuilder()
          .setEmoji(emoji("discordlist"))
          .setLabel("Discord List")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discordlist.gg/bot/803524726219079690/vote"),
        new ButtonBuilder()
          .setEmoji(emoji("discordbotsgg"))
          .setLabel("DiscordBots.gg")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discordbots.gg/bot/803524726219079690/vote")
      )
    await interact.editReply({
      embeds: [embed],
      components: [row1, row2],
      flags: 64
    })
  }
}