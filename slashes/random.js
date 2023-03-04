const { 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder
} = require("discord.js")
const { usernamelist } = require('../data/usernamer')
const uuidForName = require("../api/mcuuid")

module.exports = {
  cooldown: 5,
  usage: {
    desc: "This command is same with </skin:939378004575010826> but\nthe username was randomized",
    id: "939411396439990375"
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
}  }
}