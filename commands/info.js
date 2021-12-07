const Discord = require("discord.js")
const prefixModel = require("./../events/prefix")

module.exports = {
	name: 'info',
	description: 'Show the bots informations',
	aliases: ['aleas1', 'alias2'],
	usage: '',
	guildOnly: false,
	args: false,
	execute: async (message, args, client, prefix) => {
    let { norme, colors } = require('./../utils/config.json');
    const ping = Date.now() - message.createdTimestamp
		const embed = new Discord.MessageEmbed()
      .setTitle("**Info**")
      .setDescription("Here a few information about this bot")
      .addFields(
				{ name: 'Bots itself', value: '<@803524726219079690>', inline: true },
        { name: 'Creator/Founder', value: '<@657951960397381684>', inline: true },
        { name: 'Ping', value: `Ping: ${ping}ms` },
        { name: 'Prefix', value: `\`${prefix}\`` },
        )
      .setFooter(norme.footer)
      .setColor(colors.default)
      .setThumbnail('https://cdn.discordapp.com/avatars/803524726219079690/e672e8117793e3df603b2f85501e5f62.png?size=1024')
    message.channel.send({ embeds: [embed]})
	},
};