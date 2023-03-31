import {
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js"
import{ items } from "../data/usernamer.js"

let item = new Map(items.map(e => [e[0].toLowerCase(), e[1]]))
export default {
  cooldown: 6,
  category: "Minecraft Utilities",
  usage: {
    desc: "Thanks to [SkinMc](https://skinmc.net), you can now generate an image of Minecraft Achievements directly in Discord!"
  },
  data: new SlashCommandBuilder()
    .setName("text")
    .setDescription("From text to image, very cool")
    .addStringOption(option =>
      option.setName("title")
        .setDescription("Text for Yellow text")
        .setRequired(true)
        .setMaxLength(23)
    )
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Put text that gonna turn into a image')
        .setRequired(true)
        .setMaxLength(23)
    )
    .addStringOption(option =>
      option.setName("item")
        .setDescription("Choose an Item")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async execute(interact, client) {
    const { norme, colors } = client.config
    let itemlist = items.map((i) => {
      return i.name
    })
    let text = interact.options.getString("text")
    let title = interact.options.getString("title")
    let thing = item.get(interact.options.getString("item").toLowerCase())
    if (!thing) return interact.reply({
      embeds: [new EmbedBuilder()
        .setTitle("Invalid Item")
        .setDescription(`The only item exist is\n**${itemlist.join(", ")}**`)
        .setColor(colors.error)
        .setFooter({
          text: norme.footer
        })
      ],
      ephemeral: true
    });
    let url = `https://skinmc.net/en/achievement/${thing}/${encodeURI(title)}/${encodeURI(text)}`
    let embed = new EmbedBuilder()
      .setTitle("Text to Image")
      .setImage(url)
      .setColor(colors.default)
      .setFooter({
        text: norme.footer
      })
      .setAuthor({
        name: title,
        iconURL: "https://skinmc.net/img/icons/favicon.png"
      })
    let limit = new EmbedBuilder()
      .setTitle("Character Limit")
      .setDescription(`Your character have been over 20 which the limit. Please try again the character below the 20`)
      .setColor(colors.error)
      .setFooter({
        text: norme.footer
      })
    if (text.length > 23 || title.length > 23) {
      await interact.deferReply({
        ephemeral: true
      })
      await interact.editReply({
        embeds: [limit],
        ephemeral: true
      })
    } else {
      await interact.deferReply()
      await interact.editReply({
        embeds: [embed]
      })
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = items.filter(choice => choice[0].toLowerCase().startsWith(focusedValue) || choice[0].toLowerCase().includes(focusedValue));
    while (filtered.length > 25) filtered.pop();
    await interaction.respond(
      filtered.map(choice => ({
        name: choice[0],
        value: choice[0].toLowerCase()
      })),
    );
  },
}