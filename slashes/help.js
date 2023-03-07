const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js")

module.exports = {
  cooldown: 5,
  category: "General",
  usage: {
    desc: "Showing How to use this bot"
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of Commands. yeah"),
  async execute(interact, client) {
    const {
      config: { norme, colors }
    } = client
    await interact.deferReply({ ephemeral: true })
    let commands = Array.from(client.slash.values())
    let categories = commands.reduce((acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    }, {});
    const embed = new EmbedBuilder()
      .setTitle('Select Categories')
      .setDescription("Select any categories from selection menu given below to view commands")
      .setColor(colors.default)
      .setFooter({
        text: norme.footer
      })
    let cat = Object.keys(categories).map(category => {
      if (!category) category = `Default`;
      return {
        label: category,
        value: 'help_' + category,
      };
    });
    let menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`help`)
        .setPlaceholder('Select your category')
        .addOptions(cat),
    );
    await interact.editReply({
      embeds: [embed],
      components: [menu],
      ephemeral: true
    })
  }, 
  async selectmenu (interact, client, helpCache) {
    const {
      colors,
      norme
    } = client.config
    let category = interact.values[0].split("_")[1];
    if (helpCache.has(category)) {
      await interact.update({
        embeds: [helpCache.get(category)]
      })
      return;
    }
    let commandArray = Array.from(client.slash.values());
		let commands = commandArray.filter(command => {
			return command.category === category;
		});
    let newCommands = []
    commands.forEach(e => {
      const name = e.data.name
      const id = client.slashId.get(name)
      const desc = e.usage
      if (desc.desc) {
        newCommands.push(`</${name}:${id}> - ${desc.desc}`)
      } else {
        Object.entries(desc).forEach(e => {
          newCommands.push(`</${name} ${e[0]}:${id}> - ${e[1]}`)
        })
      }
    })
    const embed = new EmbedBuilder()
      .setTitle(`Help | ${category}`)
      .setDescription(`${newCommands.join(`\n`)}`)
      .setColor(colors.default)
      .setFooter({ text: norme.footer})
    helpCache.set(category, embed)
    await interact.update({ embeds: [embed] })
  }
}
