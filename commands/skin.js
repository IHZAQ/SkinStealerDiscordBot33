const Discord = require("discord.js")
const { prefix, colors, norme } = require('./../utils/config.json');
const embedColor = colors.default;
const errorColor = colors.error;
const footer = norme.footer
let MinecraftAPI = require("minecraft-api")

module.exports = {
  name: 'skin',
  description: 'steal skin of minecraft player',
  aliases: ['>', 'skin'],
  usage: '[username]',
  guildOnly: false,
  args: true,
  execute: async (message, args, client) => {
    const uuid = await MinecraftAPI.uuidForName(args[0])
    const download = `https://minotar.net/download/${args[0]}`
    const avatar = `https://minotar.net/helm/${args[0]}`
    const body = `https://crafatar.com/renders/body/${uuid}?overlay=true`
    const head = `https://crafatar.com/renders/head/${uuid}?overlay=true`
    let embed = new Discord.MessageEmbed()
      .setTitle(`${args[0]}'s skin`)
      .setColor(embedColor)
      .setFooter(footer)
      .setImage(body)
      .setThumbnail(head)
      .setAuthor('Download Skin', avatar, download)
    let errorMessage = new Discord.MessageEmbed()
      .setTitle("Username Error")
      .setColor(errorColor)
      .setFooter(footer)
      .setDescription("**Minecraft Username Requirements**")
      .addFields(
        { name: 'No Space', value: 'The minecraft username must be one character with no space', inline: true },
        { name: 'Must ASCII letter', value: 'It must 0-9,  all upper/lowercase alphabet and underscore `_`' },
        { name: 'Players Existent', value: 'Some username you type are not exist' },
        { name: '3-16 Character', value: 'Username must be between 3 and 16 character' })
    if (!args[1] && args[0] && uuid) return message.channel.send({ embeds: [embed]})
    else {
      message.channel.send({ content: `<@${message.author.id}>, there something you need to know,`,embeds: [errorMessage]})
        .then(msg => {
          setTimeout(() => msg.delete(), 10000)
        })
        .catch(console.error);
      client.channels.cache.get(message.channel.id).messages.fetch(message.id).then(message => message.delete())
    }
  },
};