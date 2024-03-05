import { ttm, mtt } from "../data/morse.js"
import {
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js"
export default {
  cooldown: 6,
  category: "Fun / Utilities",
  usage: {
    desc: "Convert Text to Morse Code and Vice Versa"
  },
  data: new SlashCommandBuilder()
    .setName("morse")
    .setDescription("Convert Text to Morse Code and Vice Versa")
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("Text/Morse Code here")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("decision")
        .setDescription("Whether Text->Morse or Morse->Text")
        .addChoices({
          name: "Text => Morse",
          value: "ttm"
        },{
          name: "Morse => Text",
          value: "mtt"
        })
        .setRequired(true)),
  execute: async (interaction, {embErr, config: {norme, colors}}) => {
    const decision = interaction.options.getString("decision")
    const prompt = interaction.options.getString("prompt").toLowerCase()
    const embed = new EmbedBuilder()
      .setTitle("Morse Code Interpreter")
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
    let ans;
    switch (decision) {
      case "ttm":
        if(!(/^[a-z0-9\s.?!]+$/).test(prompt)) return interaction.reply({
          embeds: [embErr("For Text to Morse\nPlease use **Text** with only all letters and numbers")],
          ephemeral: true
        });
        ans = prompt.split("").map(e => ttm[e]).join(" ");
        embed.addFields({
          name: "Text",
          value: `\`${prompt}\``
        },{
          name: "Morse",
          value: `\`\`\`${ans}\`\`\``
        })
        break;
      case "mtt":
        if(!(/^[.\-_/ ]+$/.test(prompt))) return interaction.reply({
          embeds: [embErr("For Morse to Text\nPlease use **Dots(.)** and **Dash(-)/Underscore(_)** for Morse Code\n**Slash(/)**is for Space")],
          ephemeral: true
        });
        ans = prompt.replaceAll("_", "-").split(" ").map(e => (mtt[e] || "×")).join("");
        embed.addFields({
          name: "Morse",
          value: `\`\`\`${prompt. replaceAll("_", "-")}\`\`\``
        },
        {
          name: "Text",
          value: `\`${ans}\``
        })
    }
    interaction.reply({
      embeds: [embed]
    })
  }
}