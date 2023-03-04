const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
module.exports = async (interact, noblox, EmbedBuilder, wait ,{ norme, colors }) => {
  const usern = interact.options.getString("username")
  if (!usern) return;
  const id = await noblox.getIdFromUsername(usern).catch((e) => { });
  const error = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("The users you looking for does not exist. Try others")
    .setColor(colors.error)
    .setFooter({ text: norme.footer })
  const noname = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("This users doesn't have a history of names")
    .setColor(colors.error)
    .setFooter({ text: norme.footer })
  if (!id) return await interact.reply({ embeds: [error], ephemeral: true });
  const { oldNames, username, displayName, isBanned } = await noblox.getPlayerInfo({ userId: id }).catch((e) => { })
  if (!oldNames || !oldNames.length) return await interact.reply({ embeds: [noname], ephemeral: true });
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
it interact.editReply(content)
}
