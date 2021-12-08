const Discord = require("discord.js")
const prefixModel = require("./../events/prefix")
const { Permissions } = require('discord.js');
const config = require('./../utils/config.json')

module.exports = {
  name: 'prefix',
  description: 'Set Custom Prefix',
  aliases: ['aleas1', 'alias2'],
  usage: '[Prefix]',
  guildOnly: false,
  args: false,
  execute: async (message, args, client, prefix) => {
    let seccom = ["reset", "set"]
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return;
    const data = await prefixModel.findOne({
      GuildID: message.guild.id
    });
    let errFirArgs = new Discord.MessageEmbed()
      .setTitle("How to use this commands")
      .setFields(
        {
          name: 'List:', value: `\`${prefix}prefix set {any prefix}\` - set custom prefix \n 
        \`${prefix}prefix reset\` - reset the prefix to \`st!\``, inline: true
        },
      )
      .setDescription("Other than that will send an error")
      .setFooter(config.norme.footer)
      .setColor(config.colors.error)
    if (!args[0] || !seccom.includes(args[0])) return message.reply({ embeds: [errFirArgs] })
      .then(msg => {
        setTimeout(() => msg.delete(), 10000)
        setTimeout(() => client.channels.cache.get(message.channel.id).messages.fetch(message.id).then(message => message.delete()),10000)
      })
      .catch(console.error);
    if (args[0] === "reset") {
      await prefixModel.findOneAndRemove({
        GuildID: message.guild.id
      })
      message.channel.send({ content: `Your prefix has been resetted to **\`${config.prefix}\`**` })
    }
    if (args[0] === "set") {
      if (!args[1]) return message.channel.send({ content: 'You must provide a **new prefix**!' });
      if (args[1].length > 5) return message.channel.send({ content: 'Your new prefix must be under \`5\` characters!' });
      if (data) {
        await prefixModel.findOneAndRemove({
          GuildID: message.guild.id
        })

        message.channel.send({ content: `The new prefix is now **\`${args[1]}\`**` });

        let newData = new prefixModel({
          Prefix: args[1],
          GuildID: message.guild.id
        })
        newData.save();
      } else if (!data) {
        message.channel.send({ content: `The new prefix is now **\`${args[1]}\`**` });

        let newData = new prefixModel({
          Prefix: args[1],
          GuildID: message.guild.id
        })
        newData.save();
      }
    }
    if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({ content: "Fun Fact: you not admin (Im lazy to make embed)" })
  },
};
