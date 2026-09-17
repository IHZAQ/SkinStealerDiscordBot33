import {
  SlashCommandBuilder,
  EmbedBuilder,
  ModalBuilder,
  LabelBuilder,
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
import { extname, basename, dirname, resolve } from 'path';
import AdmZip from 'adm-zip'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
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
    const optionInput = new TextInputBuilder()
        .setCustomId("option")
        .setPlaceholder("N or A")
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(1)
    const optionLabel = new LabelBuilder()
      .setLabel("Normal or Async")
      .setTextInputComponent(optionInput)
    const codeInput = new TextInputBuilder()
      .setCustomId("code")
      .setPlaceholder("Your code here")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
    const codeLabel = new LabelBuilder()
      .setLabel("Code")
      .setTextInputComponent(codeInput)
    modal.addLabelComponents(optionLabel, codeLabel)
    await interaction.showModal(modal)
  },
  modal: async (interaction, client) => {
    async function setupEmoji() {
      let message = ""
      const appEmojis = await interaction.client.application.emojis.fetch();
      const zip = new AdmZip(paths("../data/emojis.zip"));
      for (const entry of zip.getEntries()) {
          if (entry.isDirectory) continue;

          const ext = extname(entry.entryName).toLowerCase();
          const name = basename(entry.entryName, ext);
          if (!['.png', '.gif', '.jpg', '.jpeg'].includes(ext) || appEmojis.find(e => e.name === name)) {
              continue;
          }

          try {
              const newEmoji = await interaction.client.application.emojis.create({
                  attachment: entry.getData(),
                  name: name
              });
              appEmojis.set(newEmoji.id, newEmoji);

              message += `[+] Successfully uploaded: ${name}\n`;
              await sleep(2000);
          } catch (error) {
              message += `[-] Failed to upload ${name}:\n${error.message}\n`
          }
      }

      const emojiData = {};
      appEmojis.forEach(e => {
          emojiData[e.name] = e.id;
      });

      fs.writeFileSync(paths("../../emoji.json"), JSON.stringify(emojiData, null, "\t"));
      message += `[✓] Sync complete! emoji.json has been updated.`
      return message;
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
      let changed = text.substring(0, 4080)
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
      let changed = err.stack.substring(0, 4080)
      if (err.stack !== changed) {
        changed += "..."
      }
      await interaction.editReply({
        embeds: [embed(`\`\`\`xl\n${changed}\n\`\`\``, true)]
      })
    }
  }
}