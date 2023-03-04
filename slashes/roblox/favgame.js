const {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require("discord.js")
const favgame = require("../../api/favgame")
module.exports = async (interact, noblox, EmbedBuilder, wait, { norme, colors }) => {
  const username = interact.options.getString("username")
  if (!username) return;
  const id = await noblox.getIdFromUsername(username).catch((e) => { });
  const error = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("The users you looking for does not exist. Try others")
    .setColor(colors.error)
    .setFooter({ text: norme.footer })
  const nofavgame = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("This user doesn't have a favourite games")
    .setColor(colors.error)
    .setFooter({ text: norme.footer })
  if (!id) return await interact.reply({ embeds: [error], ephemeral: true });
  await interact.deferReply()
  const games = await favgame(id).catch(err => { })
  if (!games) return await interact.editReply({ embeds: [nofavgame] })
  const info = await noblox.getPlayerInfo({ userId: id }).catch((e) => { })
  const thumbnail = await noblox.getPlayerThumbnail({
    userIds: id,
    format: "png",
    cropType: "Headshot"
  }).catch((e) => { });
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setEmoji("👤")
        .setLabel('User Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://roblox.com/users/${id}/profile`)
    )
  await wait(300)
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users Favourite Games" })
    .setTitle(`${info.displayName} (@${username.toLowerCase()})`)
    .setDescription(`${games.string}`)
    .setThumbnail(thumbnail[0].imageUrl)
    .setColor(colors.default)
    .setFooter({ text: norme.footer })
  if(games.string.length > games.originlength){
    embed.addFields({
      name: 'Characters Limit Reached:',
      value: `Go to **[this website](https://sc.ihzaq.revo.gay/favgame/${id})** to see all ${username}'s games` +
      `All games cannot be shown here because characters limit was reached`
    })
  }
  let content = {
    embeds: [embed]
  }
  if (!info.isBanned) {
    content.components = [row]
  }
  await interact.editReply(content)
}await interact.editReply(content)
}