const { Events } = require("discord.js")
const { developers } = require("./../utils/config")

module.exports = {
  event: Events.MessageCreate,
  run: async (message, client) => {
    let { content, author: { id } } = message
    if (!developers.includes(id)) return;
    if (content.startsWith("STleftguild")) {
      let guildid = content.slice(12).trim()
      let guild = client.guilds.cache.get(guildid)
      if (!guild) return message.react("❔");
      guild.leave()
    }
    if (content.startsWith("STeval")) {
      const clean = async (text) => {
        if (text && text.constructor.name == "Promise")
          text = await text;
        if (typeof text !== "string")
          text = require("util").inspect(text, { depth: 1 });
        text = text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
        return text;
      }
      const args = message.content.slice(7).split(" ")
      try {
        const evaled = eval(args.join(" "));
        let cleaned = await clean(evaled);
        cleaned = cleaned.replace(process.env.TOKEN, "[Token]")
        if (cleaned !== undefined) {
          message.channel.send(`\`\`\`js\n${cleaned}\n\`\`\``).catch(err => { message.channel.send("character is too long probably") });
        }
      } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${err}\n\`\`\``).catch(r => { });
      }
    }
  }
}
