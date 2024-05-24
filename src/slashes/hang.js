import {
  EmbedBuilder,
  SlashCommandBuilder,
  ButtonStyle,
  ButtonBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { pic, random } from "../data/hang.js";
let game = new Map();
export default {
  category: "Fun / Utilities",
  cooldown: 10,
  usage: {
    desc: "Play Hangman directly in Discord",
  },
  data: new SlashCommandBuilder()
    .setName("hang")
    .setDescription("Play Hangman directly in Discord")
    .addSubcommand((command) =>
      command.setName("man").setDescription("Start Game"),
    ),
  async execute(interact, client) {
    const {
      config: { norme, colors },
      embErr,
    } = client;
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`s-hang-${interact.user.id}-answer`)
        .setLabel("Save This Man")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId(`s-hang-${interact.user.id}-stop`)
        .setLabel("Hang")
        .setStyle(ButtonStyle.Danger)
    );
    if (!game.has(interact.user.id)) {
      const { word, category } = random();
      let cencored = "_".repeat(word.length).split("");
      const timeout = setTimeout(() => {
        game.delete(interact.user.id);
        interact.editReply({
          embeds: [
            new EmbedBuilder()
              .setTitle("Hanged The Man")
              .setColor(colors.error)
              .setDescription(`The word is \`${word}\``)
              .setImage(pic[8])
              .setFooter({ text: norme.footer }),
          ],
          components: [],
        });
      }, 90000);
      game.set(interact.user.id, {
        timeout,
        word,
        category,
        cencored,
        letterList: [],
        time: Math.floor((Date.now()/1000) + 120)
      });
    } else {
      return interact.reply({
        embeds: [embErr("You already have a game in progress!")],
        ephemeral: true,
      });
    }
    const { category, cencored, time } = game.get(interact.user.id);
    const embed = new EmbedBuilder()
      .setTitle("Hangman")
      .setDescription(
        `
Category: ${category}
\`${cencored.join(" ")}\`
The man need your help <t:${time}:R>
Use the button to save the man
`,
      )
      .setColor(colors.default)
      .setFooter({ text: norme.footer })
      .setImage(pic[0]);
    interact.reply({
      embeds: [embed],
      components: [button],
    });
  },
  async button(interact, { embErr, config: { colors, norme } }) {
    const [, , id,type] = interact.customId.split("-");
    const { timeout, category, word } = game.get(interact.user.id)
    if (id !== interact.user.id) {
      return interact.reply({
        embeds: [
          embErr(
            `This is not your game!\nCreate a new game using </hang man:${client.slashId.get("hang")}>`,
          ),
        ],
        ephemeral: true,
      });
    }
    if(type === "stop"){
      clearTimeout(timeout)
      game.delete(interact.user.id)
      return interact.update({
        embeds: [new EmbedBuilder()
          .setTitle("You Hanged The Man")
          .setDescription(`
Category: ${category}
\`${word.split("").join(" ")}\`
`)
          .setImage(pic[8])
          .setColor(colors.error)
          .setFooter({ text: norme.footer })
        ],
        components: []
      })
    }
    const modal = new ModalBuilder()
      .setCustomId("hang-save")
      .setTitle("Save The Man");
    const input = new TextInputBuilder()
      .setCustomId("letter")
      .setLabel("Guess the letter to save the man")
      .setPlaceholder("The Letter")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(1);
    const first = new ActionRowBuilder().addComponents(input);
    modal.addComponents(first);
    await interact.showModal(modal);
  },
  async modal(interact, { config: { colors, norme }, embErr }) {
    if (!interact.message.components[0]) return;
    const letter = interact.fields.getTextInputValue("letter").toUpperCase();
    if (/[^a-zA-Z]/.test(letter)) {
      return interact.reply({
        embeds: [embErr("This input only accepted letter")],
        ephemeral: true,
      });
    }
    let { timeout, word, category, cencored, letterList, time } = game.get(
      interact.user.id,
    );
    if (letterList.includes(letter)) {
      return interact.reply({
        embeds: [embErr("You already guessed this letter!")],
        ephemeral: true,
      });
    }
    const embed = EmbedBuilder.from(interact.message.embeds[0]);
    if (word.includes(letter)) {
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          cencored[i] = letter;
        }
      }

      if (!cencored.includes("_")) {
        clearTimeout(timeout);
        game.delete(interact.user.id);
        return interact.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("Un-hanged The Man")
              .setDescription(
                `Category: ${category}\n\`${cencored.join(" ")}\``,
              )
              .setColor(colors.default)
              .setFooter({ text: norme.footer })
              .setImage(pic[7]),
          ],
          components: [],
        });
      }
      letterList.push(letter);
      embed.setDescription(`
Category: ${category}
\`${cencored.join(" ")}\`
The man need your help <t:${time}:R>
Use the button to save the man
`);
      embed.setFields({ name: "Guessed Letters", value: letterList.join(",") });
      game.set(interact.user.id, {
        timeout,
        word,
        category,
        cencored,
        letterList,
        time
      });
      await interact.update({
        embeds: [embed],
      });
    } else {
      letterList.push(letter);
      let mistake = pic.indexOf(embed.toJSON().image.url);
      if (mistake < 6) {
        embed.setImage(pic[mistake + 1]);
        if (letterList[0]) {
          embed.setFields({
            name: "Guessed Letters",
            value: letterList.join(","),
          });
        }
        game.set(interact.user.id, {
          timeout,
          word,
          category,
          cencored,
          letterList,
          time
        });
        await interact.update({
          embeds: [embed],
        });
      } else {
        clearTimeout(timeout);
        game.delete(interact.user.id);
        letterList = [];
        embed
          .setDescription(
            `
Category: ${category}
\`${word.split("").join(" ")}\`
`,
          )
          .setImage(pic[8])
          .setTitle("Hanged The Man")
          .setColor(colors.error);
        await interact.update({
          embeds: [embed],
          components: [],
        });
      }
    }
  },
};