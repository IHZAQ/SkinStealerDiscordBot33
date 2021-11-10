const Discord = require("discord.js")
const { norme, colors } = require('./../utils/config.json');

module.exports = {
	name: 'vote',
	description: 'voting this bot',
	aliases: ['aleas1', 'alias2'],
	usage: '',
	guildOnly: false,
	args: false,
	execute: async (message, args, client) => {
    if(message.author.bot) return;
		const embed = new Discord.MessageEmbed()
      .setTitle("Vote")
      .setDescription("Wanna vote me? Aww you soo nice.")
      .addFields(
				{ name: 'Top.gg', value: '**[Vote](https://top.gg/bot/803524726219079690/vote)**', inline: true },
				{ name: 'Discord bot list', value: '**[Upvote](https://discordbotlist.com/bots/skin-stealer/upvote)**', inline: true},
	)
      .setFooter(norme.footer)
      .setColor(colors.default)
    message.channel.send(embed)
	},
};