const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")
module.exports = async (interact, noblox, EmbedBuilder, wait, { norme, colors }) => {
  const emoji = require("../../api/badges")
  const username = interact.options.getString("username")
  if (!username) return;
  let id = await noblox.getIdFromUsername(username).catch((e) => { });
  const error = new EmbedBuilder()
    .setTitle("Error")
    .setDescription("The users you looking for does not exist. Try others")
    .setColor(colors.error)
    .setFooter({ text: norme.footer })
  if (!id) return await interact.reply({ embeds: [error], ephemeral: true });
  await interact.deferReply();
  await wait(300);
  const info = await noblox.getPlayerInfo({ userId: id }).catch((e) => { })
  const blurb = info.blurb
  const badges = await emoji(id.toString()).catch((e) => { });
  const thumbnail = await noblox.getPlayerThumbnail({
    userIds: id,
    format: "png",
    cropType: "Headshot"
  }).catch((e) => { });
  const date = await (async () => {
    let unixdate = parseInt((new Date(info.joinDate).getTime() / 1000).toFixed(0))
    return [
      `<t:${unixdate}:D>`,
      `<t:${unixdate}:R>`
      ] 
  })()
  //Embed
  if (!info) return interact.editReply({ content: "A shit has occured" });
  let name = `${info.displayName} (@${info.username.toLowerCase()})`
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users" })
    .setTitle(name)
    .setFooter({ text: norme.footer })
    .setThumbnail(thumbnail[0].imageUrl)
  let row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setEmoji("👤")
        .setLabel('User Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://roblox.com/users/${id}/profile`),
    );
  if (info.isBanned) {
    embed
      .setColor(colors.error)
      .setDescription("`[This user is banned from roblox]`")
    if (date) {
      embed.addFields({
        name: 'Join date:',
        value: date.join(", ")
      })
    }
    embed.addFields({ name: 'User id:', value: `**\`${id}\`**`, inline: true })
    row = undefined
  } else {
    const follower = info.followerCount
    const following = info.followingCount
    const friend = info.friendCount
    embed
      .setColor(colors.default)
    if (friend) {
      embed.addFields({
        name: "Friends:",
        value: friend.toLocaleString("en-US" ),
        inline: true
      })
    }
    if (follower) {
      embed.addFields({
        name: "Followers:",
        value: follower.toLocaleString("en-US"),
        inline: true
      })
    }
    if (following) {
      embed.addFields({
        name: "Following:",
        value: following.toLocaleString("en-US"),
        inline: true
      })
    }
    if (blurb) {
      embed.addFields({
        name: 'Description:',
        value: `\`${blurb}\``
      })
    }
    if (badges) {
      embed.addFields({
        name: 'Badges:',
        value: badges
      })
    }
    if (date) {
      embed.addFields({ 
        name: 'Join date:',
        value: date.join(", ")
      })
    }
    embed.addFields({
      name: 'User id:',
      value: `**\`${id}\`**`, 
      inline: true
    })
  }
  let content = {
    embeds: [embed]
  }
  if (row) {
    content.components = [row]
  }
  // Ends of Embed
  await interact.editReply(content);
}