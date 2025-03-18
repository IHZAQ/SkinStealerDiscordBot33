import emoji from "../../data/texttoemoji.js"
export default async (interact, { colors, norme }, text, Embed, checkPerms) => {
  await interact.deferReply(checkPerms(interact))
  let letter = text.toLowerCase().split("")
  letter = letter.map(e => emoji[e] || e)
  while (letter.join(" ").length > 4096) letter.pop();
  const embed = new Embed()
    .setTitle("Text to Emoji")
    .setDescription(letter.join(" "))
    .setColor(colors.default)
    .setFooter({
      text: norme.footer
    })
  await interact.editReply({
    embeds: [embed]
  })
}