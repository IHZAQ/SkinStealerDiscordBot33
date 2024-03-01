import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js"
export default {
  cooldown: 6,
  category: "Fun / Utilities",
  usage: {
    desc: "Base 2-36 Number Converter"
  },
  data: new SlashCommandBuilder()
    .setName("basechg")
    .setDescription("Base 2-36 Number Converter")
    .addStringOption(option =>
      option.setName("num1")
        .setDescription("First Number")
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("base1")
        .setDescription("Base Of First Number")
        .setMinValue(2)
        .setMaxValue(36)
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName("base2")
        .setDescription("Base Of Result Number")
        .setMinValue(2)
        .setMaxValue(36)
        .setRequired(true)),
  execute: async (interaction, {embErr, config: {norme, colors}}) => {
    const num1 = interaction.options.getString("num1")
    if(!(/^[a-zA-Z0-9]+$/.test(num1))) {
      interaction.reply({
        embeds: [embErr("You can only put numbers and letters")],
        ephemeral: true
      })
      return;
    }
    const base1 = interaction.options.getInteger("base1")
    const base2 = interaction.options.getInteger("base2")
    const changed = parseInt(num1, base1).toString(base2).toUpperCase()
    if((!changed) && (changed !== 0)) {
      interaction.reply({
        embeds: [embErr(`The Number ${num1} is not in the Base ${base1}`)],
        ephemeral: true
      })
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle("Base Converter")
      .addFields({
        name: "Given Number",
        value: `${num1.toUpperCase()} (Base ${base1})`
      },
      {
        name: "Converted Number",
        value: `${changed} (Base ${base2})`
      })
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
    interaction.reply({
      embeds: [embed]
    })
  }
}