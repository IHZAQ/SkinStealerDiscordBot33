import {
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js"

import achievement from "./text/achievement.js"
import toemoji from "./text/toemoji.js"

import items from "../data/achievement.js"
const convert = str => str.split('_').map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(' ');
export default {
  cooldown: 8,
  category: "Minecraft Utilities",
  usage: {
    achievement: "Thanks to [SkinMc](https://skinmc.net), you can now generate an image of Minecraft Achievements directly in Discord!",
    toemoji: "You can turn your text into discord letter emoji! After it finished, you can copy it and send it to your friend! And etc"
  },
  data: new SlashCommandBuilder()
    .setName("text")
    .setDescription("From text to image, very cool")
    .addSubcommand(command =>
      command
        .setName("achievement")
        .setDescription("Achievement Picture Builder")
        .addStringOption(option =>
          option
            .setName("title")
            .setDescription("Text for Yellow text")
            .setRequired(true)
            .setMaxLength(24)
        )
        .addStringOption(option =>
          option
            .setName('text')
            .setDescription('Put text that gonna turn into a image')
            .setRequired(true)
            .setMaxLength(24)
        )
        .addStringOption(option =>
          option
            .setName("item")
            .setDescription("Choose an Item")
            .setRequired(true)
            .setAutocomplete(true)
        ))
    .addSubcommand(command =>
      command
        .setName("toemoji")
        .setDescription("Turns Normal Text into Letter Emoji")
        .addStringOption(option =>
          option
            .setName("text")
            .setDescription("Text Prompt")
            .setRequired(true)
        )),
  async execute(interact, { config }) {
    const command = interact.options.getSubcommand()
    let text = interact.options.getString("text")
    switch (command) {
      case "achievement":
        await achievement(interact, config, text, EmbedBuilder, items)
        break;
      case "toemoji":
        await toemoji(interact, config, text, EmbedBuilder)
    }
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = items.filter(choice => choice.toLowerCase().startsWith(focusedValue) || choice.toLowerCase().includes(focusedValue));
    while (filtered.length > 25) filtered.pop();
    await interaction.respond(
      filtered.map(choice => ({
        name: convert(choice),
        value: choice
      }))
    );
  },
}