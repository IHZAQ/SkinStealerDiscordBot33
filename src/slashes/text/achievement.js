export default async (interact, { norme, colors }, text, Embed, items) => {
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
    ephemeral: true
  });
  await interact.deferReply()
  let url = `https://ag.nexcord.pro/generate?title=${encodeURI(title)}&description=${encodeURI(text)}&icon=${item}`
  if (titleColor) url += `&color1=${titleColor.toUpperCase()}`;
  if (textColor) url += `&color2=${textColor.toUpperCase()}`;
  let embed = new Embed()
    .setTitle("Achievement Image Builder")
    .setImage(url)
    .setColor(colors.default)
    .setFooter({
      text: norme.footer
    })
  await interact.editReply({
    embeds: [embed]
  })
}