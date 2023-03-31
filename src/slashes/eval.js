import { 
  SlashCommandBuilder,
  EmbedBuilder
} from "discord.js"
import { inspect } from "util"
export default {
  dev: true,
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("Evaluate your code here")
    .addStringOption(option =>
      option.setName("code")
        .setDescription("Your evaluation code here")
        .setRequired(true)),
  execute: async (interaction, client) => {
    const { norme, colors } = client.config
    await interaction.deferReply()
    const args = interaction.options.getString("code")
    const embed = (text, error) => {
      const color = error ? colors.error : colors.default;
      const title = error ? "Evaluation Error" : "Evaluation";
      return new EmbedBuilder()
        .setTitle(title)
        .setDescription(text)
        .setColor(color)
        .setFooter({ text: norme.footer })
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