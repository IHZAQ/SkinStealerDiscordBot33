const {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js")
const helpCache = new Map()
const {
  emoji, 
  description
} = require("../data/category")

module.exports = {
  cooldown: 5,
  category: "General",
  usage: {
    desc: "Basically, the commands you are using right now"
  },
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("List of Commands. yeah"),
  async execute(interact, client) {
    const {
      config: { norme, colors },
      slashId
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
      .setTitle('🏠 Help Menu')
      .setDescription("Welcome to Help Menu!\nIn here, you can explore various types of commands by choosing a category below.")
      .addFields({
        name: "Featured Commands:", 
        value: `> </skin:${slashId.get("skin")}> - Grabbing Minecraft Player Skin easily\n` +
               `> </roblox player:${slashId.get("roblox")}> - Fetch Roblox Player Information with just it username/id\n` +
               `> </info:${slashId.get("info")}> - Show detailed bot stats and credits that help this bot works`
      }, {
        name: "Useful Links:", 
        value: "[Support Server](https://discord.gg/3d3HBTvfaT) | [Github Repo](https://github.com/IHZAQSTORM33/SkinStealerDiscordBot33) | [Top.gg](https://top.gg/bot/803524726219079690) | [Developer](https://ihz.carrd.co)"
      })
      .setColor(colors.default)
      .setFooter({
        text: norme.footer
      })
    if(!helpCache.get("Help Menu")) helpCache.set("Help Menu", embed);
    let cat = Object.keys(categories).map(category => {
      if (!category) category = `Default`;
      return {
        label: category,
        description: description.get(category), 
        emoji: emoji.get(category),
        value: 'help_' + category,
      };
    });
    cat.unshift({
      label: "Help Menu",
      description: "Main Menu of Help Commands", 
      emoji: "🏠", 
      value: 'help_menu'
    })
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
  async selectmenu (interact, client) {
    const {
      colors,
      norme
    } = client.config
    let category = interact.values[0].split("_")[1];
    if (category === "menu") {
      await interact.update({
        embeds: [helpCache.get("Help Menu")]
      })
      return;
    }
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
      .setTitle(`Category | ${emoji.get(category)} ${category}`)
      .setDescription(`${newCommands.join(`\n\n`)}`)
      .setColor(colors.default)
      .setFooter({ text: norme.footer})
    helpCache.set(category, embed)
    await interact.update({ embeds: [embed] })
  }
}
