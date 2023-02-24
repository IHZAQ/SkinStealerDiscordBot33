const { EmbedBuilder, Events } = require("discord.js")
const {
  colors,
  norme, 
  channels: { guildleft }
} = require("../utils/config")
module.exports = {
  event: Events.GuildDelete,
  run: async (guild, client) => {
    if(!guild.available || !guildleft) return;
    const goodbye = client.channels.cache.get(guildleft)
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