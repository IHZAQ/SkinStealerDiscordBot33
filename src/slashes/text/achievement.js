import { drawImage, items } from "../../img/achievement.js"
import {
  AttachmentBuilder
} from "discord.js"

export default async (interact, { norme, colors }, text, Embed, checkPerms) => {
  let title = interact.options.getString("title")
  let titleColor = interact.options.getString("title-color")
  let textColor = interact.options.getString("text-color")
  let item = interact.options.getString("item")
  if (!items.map(e => e.toLowerCase()).includes(item.toLowerCase())) return interact.reply({
    embeds: [new Embed()
      .setTitle("Invalid Item")
      .setDescription(`The only valid item is the one in autocomplete`)
      .setColor(colors.error)
      .setFooter({
        text: norme.footer
      })
    ],
    flags: 64
  });
  await interact.deferReply(checkPerms(interact))
  let data = {
    title,
    description: text,
    icon: item
  }
  if (titleColor) data.color1 = "#" + titleColor.toUpperCase();
  if (textColor) data.color2 = "#" + textColor.toUpperCase();
  const buffer = await drawImage(data);
  const img = new AttachmentBuilder(buffer, {
    name: "achievement.png"
  })
  let embed = new Embed()
    .setTitle("Achievement Image Builder")
    .setImage("attachment://achievement.png")
    .setColor(colors.default)
    .setFooter({
      text: norme.footer
    })
  await interact.editReply({
    embeds: [embed],
    files: [img]
  })
}