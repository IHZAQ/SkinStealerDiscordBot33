import {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from "discord.js"
import { inspect } from "util"
import axios from "axios"
import model from "../schema.js"
import emoji from "../../emoji.json" with { type: "json" }
import fs from "fs"
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paths = path => resolve(__dirname, path);
export default {
  dev: true,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate your code here"),
  execute: async (interaction) => {
    const modal = new ModalBuilder()
      .setCustomId("eval")
      .setTitle("Evaluation Mode")
    modal.addComponents(
      new ActionRowBuilder()
        .addComponents(
          new TextInputBuilder()
            .setCustomId("option")
            .setLabel("Normal / Async")
            .setPlaceholder("N or A")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(1)),
      new ActionRowBuilder()
        .addComponents(
          new TextInputBuilder()
            .setCustomId("code")
            .setLabel("Code")
            .setPlaceholder("Your code here")
            .setStyle(TextInputStyle.Paragraph)
        ))
    await interaction.showModal(modal)
  },
  modal: async (interaction, client) => {
    async function setupEmoji() {
      let obj = emoji;
      const emojiFetch = await interaction.guild.emojis.fetch();
      [...emojiFetch.entries()].forEach(e => {
        const boo = e[1].name in obj;
        if (!boo) return;
        obj[e[1].name] = e[0]
      })
      const json = JSON.stringify(obj, null, "\t")
      fs.writeFileSync(paths("../../emoji.json"), json)
    }
    const { norme, colors } = client.config
    await interaction.deferReply()
    const option = interaction.fields.getTextInputValue("option").toUpperCase()
    if (!["N", "A"].includes(option)) return interaction.editReply({ content: "wtf men" });
    let args = interaction.fields.getTextInputValue("code")
    if (option === "A") args = `(async () => {\n${args}\n})()`
    const embed = (text, error) => {
      const color = error ? colors.error : colors.default;
      const title = error ? "Evaluation Error" : "Evaluation";
      return new EmbedBuilder()
        .setTitle(title)
        .setDescription(text)
        .setColor(color)
        .setFooter({ text: norme.footer })
        .addFields(
          { name: "Your Code", value: `\`\`\`js\n${args}\n\`\`\`` }
        )
    }
    const clean = async (text) => {
      if (text && text.constructor.name == "Promise")
        text = await text;
      if (typeof text !== "string")
        text = inspect(text, { depth: 1 });
      text = text
        .replace(/`/g, "`" + String.fromCharCode(8203))
        .replace(/@/g, "@" + String.fromCharCode(8203));
      let changed = text.substr(0, 4080)
      if (text !== changed) {
        changed += "..."
      }
      return changed
    }
    try {
      const evaled = eval(args);
      let cleaned = await clean(evaled);
      cleaned = cleaned.replace(process.env.TOKEN, "[Token]")
      if (cleaned !== undefined) {
        await interaction.editReply({
          embeds: [embed(`\`\`\`js\n${cleaned}\n\`\`\``)]
        })
      }
    } catch (err) {
      let changed = err.stack.substr(0, 4080)
      if (err.stack !== changed) {
        changed += "..."
      }
      await interaction.editReply({
        embeds: [embed(`\`\`\`xl\n${changed}\n\`\`\``, true)]
      })
    }
  }
}