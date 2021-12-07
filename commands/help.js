const Discord = require('discord.js');
const prefixModel = require("./../events/prefix")

module.exports = {
	name: 'help',
	description: 'Get help on how to use the bot and the specific commands',
	aliases: ['?', 'h'],
	usage: '[command name]',
	guildOnly: false,
	args: false,
	execute: async (message, args, client, prefix) => {
    let { colors, norme } = require('./../utils/config.json');
    const embedColor = colors.default;
    if(message.author.bot) return;
		const { commands } = message.client;

		if (!args.length) {
			const cmdHelpEmbed = new Discord.MessageEmbed()
				.setTitle('**HELP**')
				.setDescription(
					`Command list: \n\`${commands
						.map((command) => command.name)
						.join(
							' | '
						)}\`\nYou can use \`${prefix}help {command name}\` to get more info about a specific command!`
				)
				.setColor(embedColor)
        .setFooter(norme.footer)
			return message.channel.send({ embeds: [cmdHelpEmbed]});
		}

		const name = args[0].toLowerCase();
		const command =
			commands.get(name) ||
			commands.find((cmd) => cmd.aliases && cmd.aliases.includes(name));

		if (!command) {
			return message.reply({ content: 'This command does not exist!'});
		}
		const cmdHelpEmbed = new Discord.MessageEmbed()
			.setTitle(`${command.name} | Command info`)
			.setDescription(command.description)
			.addField('Usage', `\`${prefix + command.name} ${command.usage}\``, true)
			.setColor(embedColor)
      .setFooter(norme.footer)

		if (command.aliases) {
			cmdHelpEmbed.addField(
				'Aliases',
				`\`${command.aliases.join(' | ')}\``,
				true
			);
		}

		return message.channel.send({ embeds: [cmdHelpEmbed]});
	},
};