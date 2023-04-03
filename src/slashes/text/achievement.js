export default async (
  interact, 
  { norme, colors },
  text,
  Embed,
  { items, item, itemlist }) => {
  let title = interact.options.getString("title")
  let thing = item.get(interact.options.getString("item").toLowerCase())
  if (!thing) return interact.reply({
    embeds: [new Embed()
			.setTitle("Invalid Item")
			.setDescription(`The only item exist is\n**${itemlist.join(", ")}**`)
			.setColor(colors.error)
			.setFooter({
        text: norme.footer
      })
		],
    ephemeral: true
  });
  await interact.deferReply()
  let url = `https://skinmc.net/en/achievement/${thing}/${encodeURI(title)}/${encodeURI(text)}`
  let embed = new Embed()
    .setTitle("Achievement Image Builder")
    .setImage(url)
    .setColor(colors.default)
    .setFooter({
      text: norme.footer
    })
    .setAuthor({
      name: title,
      iconURL: "https://skinmc.net/img/icons/favicon.png"
    })
  await interact.editReply({
    embeds: [embed]
  })
}