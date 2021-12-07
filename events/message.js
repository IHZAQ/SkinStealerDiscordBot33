const { MessageEmbed } = require('discord.js');
const { botPermissionCheck } = require('./../utils/permissions');
const fs = require("fs")
const prefixModel = require("./../events/prefix")

module.exports = {
  event: 'messageCreate',
  run: async (message, client) => {
    let { prefix } = require("./../utils/config.json")
    const data = await prefixModel.findOne({
      GuildID: message.guild.id
    });
    if (data) {
      prefix = data.Prefix
    }
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );
    if (!command) return;
    if (command.guildOnly && message.channel.type !== 'text') {
      return message.reply({ content: "I can't execute that command inside DMs!" })
        .then(msg => {
          setTimeout(() => msg.delete(), 10000)
        })
        .catch(console.error);
    }
    if (command.indev && message.author.id !== process.env.FOUNDER_ID) {
      return message.reply({ content: "Well that command still in development,"})
    }

    if (command.args && !args.length) {
      let reply = `You didn't provide any arguments, ${message.author}!`;
      if (command.usage) {
        reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
      }
      return message.channel.send({ content: reply });
    }

    let user = await message.guild.members.cache.get(message.author.id),
      bot = await message.guild.members.cache.get(client.user.id);

    if (command.permissions) {
      if (!command.permissions.bot) command.permissions.bot = [];
      if (!command.permissions.user) command.permissions.user = [];
      let hasPermission = await botPermissionCheck(
        message.channel,
        user,
        bot,
        command.permissions,
        command.name
      );
      if (!hasPermission) {
        return;
      }
    }

    try {
      command.execute(message, args, client, prefix);
    } catch (error) {
      console.error(error);
      message.reply({ content: 'There was an error trying to execute that command!' })
        .then(msg => {
          setTimeout(() => msg.delete(), 10000)
        })
        .catch(console.error);
    }
  },
};