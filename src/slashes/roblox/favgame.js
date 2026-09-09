import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"
import {
  getIdFromUsername,
  getThumbnail,
  getInfo,
  favgame
} from "../../api/robloxuser.js"
import emoji from "../../data/emoji.js"

export default async (interact, EmbedBuilder, { norme, colors }, embErr, checkPerms) => {
  const username = interact.options.getString("username")
  if (!username) return;
  const id = await getIdFromUsername(username)
  const error = embErr("The users you looking for does not exist. Try others")
  const nofavgame = embErr("This user doesn't have a favourite games")
  if (!id) return await interact.editReply({ embeds: [error] });
  const games = await favgame(id)
  if (!games) return await interact.editReply({ embeds: [nofavgame] })
  await interact.editReply({
    content: "You may close this message"
  });
  const info = await getInfo(id)
  const thumbnail = await getThumbnail(id)
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setEmoji("👤")
        .setLabel('User Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://roblox.com/users/${id}/profile`)
    )
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users Favourite Games" })
    .setTitle(`${info.isPremium ? `${emoji("premium")} ` : ""}${info.displayName} (@${username.toLowerCase()})`)
    .setDescription(`${games}`)
    .setColor(colors.default)
    .setFooter({ text: norme.footer })
  if (thumbnail) {
    embed.setThumbnail(thumbnail)
  }
  let content = {
    embeds: [embed],
    ...checkPerms(interact)
  }
  if (!info.isBanned) {
    content.components = [row]
  }
  await interact.followUp(content)
}