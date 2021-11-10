const Discord = require("discord.js")
const { prefix, colors, norme } = require('./../utils/config.json');
const embedColor = colors.default;
const errorColor = colors.error;
const footer = norme.footer

module.exports = {
	name: 'skin',
	description: 'steal skin of minecraft player',
	aliases: ['>', 'skin'],
	usage: '[username]',
	guildOnly: false,
	args: true,
	execute: async (message, args, client) => {
    if(message.author.bot) return;
    const download = `https://minotar.net/download/${args[0]}`
    const avatar = `https://minotar.net/helm/${args[0]}`
    const body = `https://minotar.net/armor/body/${args[0]}`
    const head = `https://minotar.net/cube/${args[0]}`
		let embed = new Discord.MessageEmbed()
      .setTitle(args[0] + "'s skin")
      .setColor(embedColor)
      .setFooter(footer)
      .setImage(body)
      .setThumbnail(head)
      .setAuthor('Download Skin', avatar, download)
    
    let limit = new Discord.MessageEmbed()
      .setTitle("Username Limit")
      .setDescription("Ooopsie, minecraft username can be only one character.")
      .setColor(errorColor)
      .setFooter(footer)
    if(!args[1]) return message.channel.send(embed)
    if(args[1]) return message.channel.send(limit)
	},
};