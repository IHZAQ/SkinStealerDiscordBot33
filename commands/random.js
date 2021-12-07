const Discord = require("discord.js")
const { prefix, colors, norme } = require('./../utils/config.json');
const { usernamelist } = require('./../utils/usernamer.json')
let MinecraftAPI = require("minecraft-api")

module.exports = {
  name: 'random',
  description: 'Random Skin',
  aliases: ['aleas1', 'alias2'],
  usage: '',
  guildOnly: false,
  args: false,
  execute: async (message, args, client) => {
    let random = usernamelist[Math.floor(Math.random() * usernamelist.length)]
    const uuid = await MinecraftAPI.uuidForName(random)
    const download = `https://minotar.net/download/${random}`
    const avatar = `https://minotar.net/helm/${random}`
    const body = `https://crafatar.com/renders/body/${uuid}?overlay=true`
    const head = `https://crafatar.com/renders/head/${uuid}?overlay=true`
    let embed = new Discord.MessageEmbed()
      .setTitle(`Random skin`)
      .setColor(colors.default)
      .setFooter(norme.footer)
      .setImage(body)
      .setDescription(`\*\*[Download](${download})\*\* this skin`)
      .setThumbnail(head)
      .setAuthor(`${random}'s skin`, avatar)
    message.channel.send({ embeds: [embed]})
  },
};