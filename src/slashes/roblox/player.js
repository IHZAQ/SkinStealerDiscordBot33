import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} from "discord.js"
import {
  getThumbnail,
  getIdFromUsername,
  getInfo,
  emoji
} from "../../api/robloxuser.js"
import emoj from "../../data/emoji.js"

export default async (interact, EmbedBuilder, { norme, colors }, embErr, checkPerms) => {
  const username = interact.options.getString("username")
  if (!username) return;
  let id = await getIdFromUsername(username)
  if (!id) return await interact.reply({
    embeds: [embErr("The users you looking for does not exist. Try others")],
    flags: 64
  });
  await interact.deferReply(checkPerms(interact));
  const info = await getInfo(id);
  if (!info) return interact.editReply({ content: `An error has occured\nPlease use report bug commands` });
  const badges = await emoji(id).catch((e) => { });
  const thumbnail = await getThumbnail(id)
  const date = await (async () => {
    let unixdate = parseInt((new Date(info.joinDate).getTime() / 1000).toFixed(0))
    return [
      `<t:${unixdate}:D>`,
      `<t:${unixdate}:R>`
    ]
  })()
  //Embed
  let name = `${info.isPremium ? `${emoj("premium")} ` : ""}${info.displayName} (@${info.username.toLowerCase()})`
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Roblox Users" })
    .setTitle(name)
    .setFooter({ text: norme.footer })
  let row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setEmoji("👤")
        .setLabel('User Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://roblox.com/users/${id}/profile`),
    );
  if (thumbnail) {
    embed.setThumbnail(thumbnail)
  }
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
    const follower = info.followers
    const following = info.followings
    const friend = info.friends
    embed
      .setColor(colors.default)
    if (friend) {
      embed.addFields({
        name: "Friends:",
        value: friend.toLocaleString("en-US"),
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
    if (info.blurb) {
      embed.addFields({
        name: 'Description:',
        value: `\`${info.blurb}\``
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