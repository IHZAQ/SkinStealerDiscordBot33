import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"
import {
  getThumbnail,
  getIdFromUsername,
  getInfo,
  oldNames
} from "../../api/robloxuser.js"
import emoji from "../../data/emoji.js"
export default async (interact, EmbedBuilder, { norme, colors }, embErr, checkPerms) => {
  const usern = interact.options.getString("username")
  if (!usern) return;
  const id = await getIdFromUsername(usern)
  const error = embErr("The users you looking for does not exist. Try others")
  const noname = embErr("This users doesn't have a history of names")
  if (!id) return await interact.editReply({ embeds: [error] });
  const { username, displayName, isBanned, isPremium } = await getInfo(id)
  let list = await oldNames(id)
  if (!list) return await interact.editReply({ embeds: [noname] });
  await interact.editReply({
    content: "You may close this message"
  });
  while (list.join(`\n`).length > 4096) list.pop();
  const thumbnail = await getThumbnail(id);
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setEmoji("👤")
        .setLabel('User Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://roblox.com/users/${id}/profile`)
    )
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users Old Names" })
    .setTitle(`${isPremium ? `${emoji("premium")} ` : ""}${displayName} (@${username.toLowerCase()})`)
    .setDescription(list.join(`\n`))
    .setColor(colors.default)
    .setFooter({ text: norme.footer })
  if (thumbnail) {
    embed.setThumbnail(thumbnail)
  }
  let content = {
    embeds: [embed],
    ...checkPerms(interact)
  }
  if (!isBanned) {
    content.components = [row]
  }
  await interact.followUp(content)
}