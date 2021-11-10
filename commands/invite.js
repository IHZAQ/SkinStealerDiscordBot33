const Discord = require("discord.js")
const { norme, colors } = require('./../utils/config.json');

module.exports = {
	name: 'invite',
	description: 'Invite link for adding this bot to your discord Server',
	aliases: ['aleas1', 'alias2'],
  usage: '',
	guildOnly: false,
	args: false,
	execute: async (message, args, client) => {
    if(message.author.bot) return;
		const embed = new Discord.MessageEmbed()
      .setTitle("Invite")
      .setDescription("Click **[here](https://discord.com/api/oauth2/authorize?client_id=803524726219079690&permissions=490560&scope=bot)** to add me to your discord server")
      .setFooter(norme.footer)
      .setColor(colors.default)
    message.channel.send(embed)
	},
};