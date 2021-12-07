const Discord = require("discord.js")
const { prefix, colors, norme } = require('./../utils/config.json');

module.exports = {
  name: 'text',
  description: 'Text to Image',
  aliases: ['aleas1', 'alias2'],
  usage: '[text]',
  guildOnly: false,
  args: true,
  execute: async (message, args, client) => {
    let fullArgs = encodeURI(args.slice(0).join(' '));
    let original = decodeURI(fullArgs)
    const text = `https://flamingtext.com/net-fu/proxy_form.cgi?script=fluffy-logo&text=${fullArgs}+&_loc=generate&imageoutput=true`
    let embed = new Discord.MessageEmbed()
      .setTitle("Text to Image")
      .setImage(text)
      .setColor(colors.default)
      .setFooter(norme.footer)
      .setAuthor(`${original}`, "https://flamingtext.com/")
    let limit = new Discord.MessageEmbed()
      .setTitle("Character Limit")
      .setDescription(`Your character have been over 50 which the limit. Please try again the character below the 50`)
      .setColor(colors.error)
      .setFooter(norme.footer)
    if (original.length <= 49) return message.channel.send({ embeds: [embed]})
    if (original.length >= 50) {
      message.channel.send({ embeds: [limit]})
        .then(msg => {
          msg.delete({ timeout: 10000 })
        })
        .catch(console.error);
      client.channels.cache.get(message.channel.id).messages.fetch(message.id).then(message => message.delete())
    }
  },
};