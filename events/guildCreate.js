import {
  EmbedBuilder,
  Events
} from "discord.js"

export default {
  event: Events.GuildCreate,
  run: async (guild, client) => {
    if(!guild.available) return;
    const {
      colors,
      norme, 
      channels: { guildjoin }
    } = client.config
    let embed = new EmbedBuilder()
      .setTitle("Hi")
      .setDescription(`Thank you for inviting me!\nDo \`/help\` for commands list`)
      .addFields(
        { name: "What this bot can do?", value: `**.** Steal Minecraft skin\n**.** Roblox player viewer\n**.** And much more..` },
        { name: "Cool Feature?", value: "Roblox player viewer:\`/roblox player username: IHZAQSTORM33\`" }
      )
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
    if (guild.systemChannel) {
      guild.systemChannel.send({ embeds: [embed] }).catch(err => {})
    }
    if(!guildjoin) return;
    const welcome = client.channels.cache.get(guildjoin)
    if(!welcome) return;
    const owner = await client.users.fetch(guild.ownerId)
    const embedW = new EmbedBuilder()
      .setColor(colors.default)
      .setTitle(`Join Guild: ${guild.name}.`)
      .addFields(
        {
          name: "Owner:",
          value: `${owner.tag} (\`${owner.id}\`)`
        },
        {
          name: "Members:",
          value: `${guild.memberCount} member`
        },
        {
          name: "Guild Id:",
          value: `${guild.id}`
        },
        {
          name: "Server Joined:",
          value: `${client.guilds.cache.size} servers`
        }
      )
      .setTimestamp()
      .setFooter({ text: "Lightning Craft" })
    welcome.send({ embeds: [embedW] })
  }
}
