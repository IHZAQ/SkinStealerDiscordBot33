const Discord = require("discord.js")
const { norme, colors } = require('./../utils/config.json');

module.exports = {
	name: 'support',
	description: 'In case bug. use this command and report bug',
	aliases: ['aleas1', 'alias2'],
	usage: '',
	guildOnly: false,
	args: false,
	execute: async (message, args, client) => {
    if(message.author.bot) return;
		const embed = new Discord.MessageEmbed()
      .setTitle("Report Bug")
      .setDescription("Report bug? problems? Suggestion? Click **[here](https://discord.gg/3d3HBTvfaT)** to report bug")
      .setFooter(norme.footer)
      .setColor(colors.default)
    message.channel.send({ embeds: [embed]})
	},
};