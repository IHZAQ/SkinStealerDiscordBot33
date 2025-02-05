import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"
import favgame from "../../api/favgame.js"

export default async (interact, noblox, EmbedBuilder, wait, { norme, colors }, embErr) => {
  const username = interact.options.getString("username")
  if (!username) return;
  const id = await noblox.getIdFromUsername(username).catch((e) => { });
  const error = embErr("The users you looking for does not exist. Try others")
  const nofavgame = embErr("This user doesn't have a favourite games" )
  if (!id) return await interact.reply({ embeds: [error], flags: 64 });
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
        .setURL(`https://roblox.com/users/${id}/profile`), 
      new ButtonBuilder()
        .setEmoji("<:skinstealer:1082319626769289308>")
        .setLabel("More Games")
        .setStyle(ButtonStyle.Link)
        .setURL(`https://sc.ihzaq.revo.gay/favgame/${id}`)
    )
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users Favourite Games" })
    .setTitle(`${info.displayName} (@${username.toLowerCase()})`)
    .setDescription(`${games}`)
    .setThumbnail(thumbnail[0].imageUrl)
    .setColor(colors.default)
    .setFooter({ text: norme.footer })
  let content = {
    embeds: [embed]
  }
  if (!info.isBanned) {
    content.components = [row]
  }
  await interact.editReply(content)
}