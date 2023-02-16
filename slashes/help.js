const { norme, colors } = require("../utils/config")
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

module.exports = {
  cooldown: 5,
  usage: {
    desc: "Showing How to use this bot",
    id: "945926651986972683"
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of Commands. yeah")
    .addStringOption(option =>
      option
        .setName("commands")
        .setDescription("Info for each commands")
        .setAutocomplete(true)
    ),
  async execute(interact, client) {
    const { names, slashes } = client
    let command = interact.options.getString('commands')
    if (!command) {
      await interact.deferReply()
      const slash = names.map(e => {
        const name = e.split(" ")[0]
        const id = slashes.get(name).usage.id
        return `</${e}:${id}>`
      }).join(", ")

      const embed = new EmbedBuilder()
        .setTitle('**Help Commands**')
        .setDescription(
          `Commands list: \n${slash}\nYou can use \`/help {command name}\` to get more info about a specific command!`
        )
        .setColor(colors.default)
        .setFooter({ text: norme.footer })
      await interact.editReply({ embeds: [embed], ephemeral: true })
    } else {
      await interact.deferReply({ ephemeral: true })
      const slash = slashes.get(command.split(" ")[0])
      const error = new EmbedBuilder()
        .setTitle("Error")
        .setDescription(`The command you put was not valid`)
        .setColor(colors.error)
        .setFooter({ text: norme.footer })
      if (!slash) return interact.editReply({ embeds: [error] })
      const embed = new EmbedBuilder()
        .setTitle(`/${command} | Command info`)
        .setDescription(`${slash.usage.desc}`)
        .setColor(colors.default)
        .setFooter({ text: norme.footer })
      await interact.editReply({ embeds: [embed] })
    }
  },
  async autocomplete(interact, client) {
    const focusedValue = interact.options.getFocused().toLowerCase()
    const filtered = client.names.filter(e => e.startsWith(focusedValue) || e.includes(focusedValue))
    await interact.respond(
      filtered.map(e => ({
        name: `/${e}`,
        value: e
      }))
    )
  }
}
