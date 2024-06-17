export default async (interact, { norme, colors }, text, Embed, items) => {
  let title = interact.options.getString("title")
  let item = interact.options.getString("item").toLowerCase()
  if (!items.includes(item)) return interact.reply({
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