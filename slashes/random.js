import { 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder
} from "discord.js"
import { usernamelist } from '../data/usernamer.js'
import uuidForName from "../api/mcuuid.js"

export default {
  cooldown: 5,
  category: "Minecraft Utilities",
  usage: {
    desc: "This command is same with </skin:0> but the username was randomized"
  },
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("No idea for Minecraft username? try this commands!"),
  async execute(interact, client) {
    const { norme, colors } = client.config
    await interact.deferReply();
    let random = usernamelist[Math.floor(Math.random() * usernamelist.length)]
    const uuid = await uuidForName(random)
    const download = `https://minotar.net/download/${random}`
    const avatar = `https://crafatar.com/avatars/${uuid.id}?overlay=true`
    const body = `https://crafatar.com/renders/body/${uuid.id}?overlay=true`
    const head = `https://crafatar.com/renders/head/${uuid.id}?overlay=true`
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("⬇️")
          .setLabel("Download Skin")
          .setStyle(ButtonStyle.Link)
          .setURL(download)
      );
    let embed = new EmbedBuilder()
      .setTitle(`Random Skin`)
      .setColor(colors.default)
      .setFooter({ text: norme.footer })
      .setImage(body)
      .setThumbnail(head)
      .setAuthor({ name: `${uuid.name}'s skin`, iconURL: avatar })
    await interact.editReply({
      embeds: [embed],
      components: [row]
    })
  }
}