import {
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js"

import achievement from "./text/achievement.js"
import toemoji from "./text/toemoji.js"

import { items } from "../data/usernamer.js"
let itemlist = items.map((i) => {
  return i.name
})
let item = new Map(items.map(e => [e[0].toLowerCase(), e[1]]))
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
            .setMaxLength(23)
        )
        .addStringOption(option =>
          option
            .setName('text')
            .setDescription('Put text that gonna turn into a image')
            .setRequired(true)
            .setMaxLength(23)
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
        await achievement(interact, config, text, EmbedBuilder, { items, item, itemlist })
        break;
      case "toemoji":
        await toemoji(interact, config, text, EmbedBuilder)
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