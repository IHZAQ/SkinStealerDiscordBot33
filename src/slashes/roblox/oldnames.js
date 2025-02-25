import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"
export default async (interact, noblox, EmbedBuilder, wait ,{ norme, colors }, embErr) => {
  const usern = interact.options.getString("username")
  if (!usern) return;
  const id = await noblox.getIdFromUsername(usern).catch((e) => { });
  const error = embErr("The users you looking for does not exist. Try others")
  const noname = embErr("This users doesn't have a history of names")
  if (!id) return await interact.reply({ embeds: [error], flags: 64 });
  const { oldNames, username, displayName, isBanned } = await noblox.getPlayerInfo({ userId: id }).catch((e) => { })
  if (!oldNames || !oldNames.length) return await interact.reply({ embeds: [noname], flags: 64 });
  await interact.deferReply()
  function r(arr) {
    return arr.filter((item,
      index) => arr.indexOf(item) === index);
  }
  let list = r(oldNames)
  while (list.join(`\n`).length > 4096) list.pop();
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
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users Old Names" })
    .setTitle(`${displayName} (@${username.toLowerCase()})`)
    .setDescription(list.join(`\n`))
    .setThumbnail(thumbnail[0].imageUrl)
    .setColor(colors.default)
    .setFooter({ text: norme.footer })
  let content = {
    embeds: [embed]
  }
  if (!isBanned) {
    content.components = [row]
  }
  await interact.editReply(content)
}
