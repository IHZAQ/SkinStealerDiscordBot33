const Discord = require("discord.js")
const { prefix, colors, norme } = require('./../utils/config.json');

module.exports = {
  name: 'tlskin',
  description: 'Skin from TLauncher',
  aliases: ['aleas1', 'alias2'],
  usage: '[username]',
  guildOnly: false,
  args: true,
  execute: async (message, args, client) => {
    function isASCII(str) {
      return /^[\x00-\x7F]*$/.test(str);
    }
    const ascii = isASCII(args[0])
    let fullArgs = encodeURI(args.slice(0).join(' '));
    const body = `https://tlauncher.org/skin.php?username_catalog=nickname&username_file=tlauncher_${fullArgs}.png&`
    const skin = `https://tlauncher.org/upload/all/nickname/tlauncher_${fullArgs}.png`
    let embed = new Discord.MessageEmbed()
      .setTitle(`TLauncher ${decodeURI(fullArgs)}'s skin`)
      .setColor(colors.default)
      .setFooter(norme.footer)
      .setImage(body)
      .setAuthor('Download Skin', "https://tlauncher.org/apple-touch-icon.png", skin)
    let notAscii = new Discord.MessageEmbed()
      .setTitle("That's not a real character")
      .setDescription("You can only do 0-9 and uppercase/lowercase letter as username. lol")
      .setFooter(norme.footer)
      .setColor(colors.error)
    if (ascii) return message.channel.send({ embeds:[embed]})
    if (!ascii) {
      message.channel.send({ embeds: [notAscii]})
        .then(msg => {
          setTimeout(() => msg.delete(), 10000)
        })
        .catch(console.error);
      client.channels.cache.get(message.channel.id).messages.fetch(message.id).then(message => message.delete())
    }
  },
};