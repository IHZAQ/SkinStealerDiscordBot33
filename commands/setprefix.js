const Discord = require("discord.js")
const prefixModel = require("./../events/prefix")
const { Permissions } = require('discord.js');

module.exports = {
	name: 'setprefix',
	description: 'Set Custom Prefix',
	aliases: ['aleas1', 'alias2'],
	usage: '[Prefix]',
	guildOnly: false,
	args: false,
	execute: async (message, args, client) => {
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;
		const data = await prefixModel.findOne({
        GuildID: message.guild.id
    });
    if (!args[0]) return message.channel.send({ content: 'You must provide a **new prefix**!'});
    if (args[0].length > 5) return message.channel.send({ content: 'Your new prefix must be under \`5\` characters!'})
    if (data) {
        await prefixModel.findOneAndRemove({
            GuildID: message.guild.id
        })
        
        message.channel.send({ content: `The new prefix is now **\`${args[0]}\`**`});

        let newData = new prefixModel({
            Prefix: args[0],
            GuildID: message.guild.id
        })
        newData.save();
    } else if (!data) {
        message.channel.send({ content: `The new prefix is now **\`${args[0]}\`**`});

        let newData = new prefixModel({
            Prefix: args[0],
            GuildID: message.guild.id
        })
        newData.save();
    }
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({ content: "Fun Fact: you not admin (Im lazy to make embed)"})
	},
};