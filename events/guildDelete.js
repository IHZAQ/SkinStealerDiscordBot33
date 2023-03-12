import { 
  EmbedBuilder,
  Events
} from "discord.js"

export default {
  event: Events.GuildDelete,
  run: async (guild, client) => {
    if(!guild.available) return;
    const {
      colors,
      norme, 
      channels: { guildleft }
    } = client.config
    const goodbye = client.channels.cache.get(guildleft)
    if(!goodbye) return;
    const owner = await client.users.fetch(guild.ownerId).catch(err => {})
    const embed = new EmbedBuilder()
      .setColor(colors.error)
      .setTitle(`Left Guild: ${guild.name}.`)
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
      .setFooter({ text: norme.footer })
    goodbye.send({ embeds: [embed] })
  }
}