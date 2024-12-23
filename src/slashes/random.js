import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  StringSelectMenuBuilder
} from "discord.js"
import { usernamelist } from '../data/usernamer.js'
import uuidForName from "../api/mcuuid.js"

export default {
  cooldown: 5,
  category: "Minecraft Utilities",
  usage: {
    desc: "This command is same with %skin% but the username was randomized"
  },
  data: new SlashCommandBuilder()
    .setName("random")
    .setDescription("No idea for Minecraft username? try this commands!")
    .setIntegrationTypes([0,1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    let random = usernamelist[Math.floor(Math.random() * usernamelist.length)]
    const uuid = await uuidForName(random)
    if (!uuid) return interact.reply({
      embeds: [client.embErr(`The generated username is not available, run another </random:${client.slashId.get("random")}>`)],
      ephemeral: true
    });
    await interact.deferReply();
    const download = `https://mc-heads.net/download/${random}`
    const avatar = `https://mc-heads.net/avatar/${uuid.id}`
    const body = `https://mc-heads.net/body/${uuid.id}`
    const head = `https://mc-heads.net/head/${uuid.id}`
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("⬇️")
          .setLabel("Download Skin")
          .setStyle(ButtonStyle.Link)
          .setURL(download)
      );
    let embed = new EmbedBuilder()
      .setTitle(`Random Skin`)
      .setColor(colors.default)
      .setFooter({ text: norme.footer })
      .setImage(body)
      .setThumbnail(head)
      .setAuthor({ name: `${uuid.name}'s skin`, iconURL: avatar })
      .setDescription(`**UUID**: \`${uuid.id}\``)
    const sel = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`random-${interact.user.id}-${uuid.id}`)
          .setPlaceholder("Choose Part To Preview")
          .addOptions([
            {
              label: "Body",
              description: "Full 3D Representation of the Minecraft Skin",
              emoji: "<:body:1286196485804920832>",
              value: "skin_body"
            },
            {
              label: "Full Body",
              description: "Full 2D Representation of the Minecraft Skin",
              emoji: "<:papercraft:1320532080639217684>",
              value: "skin_fullbody"
            },
            {
              label: "Head",
              description: "3D Head of the Minecraft Skin",
              emoji: "<:head:1286196606944677920>",
              value: "skin_head"
            },
            {
              label: "Avatar",
              description: "2D Face of Minecraft Skin",
              emoji: "<:avatar:1286196285212332094>",
              value: "skin_avatar"
            },
            {
              label: "Skin",
              description: "Raw Minecraft Skin Image",
              emoji: "<:skin:1286196696388337736>",
              value: "skin_skin"
            },
            {
              label: "Two Layer (Default)",
              description: "Show both skin layers",
              emoji: "2️⃣",
              value: "helm_yes"
            },
            {
              label: "One Layer",
              description: "Only show the first layer of the skin",
              emoji: "1️⃣",
              value: "helm_no"
            }
          ]),
      );
    await interact.editReply({
      embeds: [embed],
      components: [sel, row]
    })
  },
  async selectmenu(interaction, client) {
    const { norme, colors } = client.config
    const [, userid, uuid] = interaction.customId.split("-")
    if (interaction.user.id !== userid) {
      return await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("This is not your random skin menu")
          .setDescription(`Create your own using </random:${client.slashId.get("random")}>`)
          .setColor(colors.error)
          .setFooter({ text: norme.footer })
        ],
        ephemeral: true
      })
    }
    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    let url = interaction.message.embeds[0].image.url
    const [menu, part] = interaction.values[0].split("_")
    if (menu == "skin") {
      url = url.replace(/(https:\/\/mc-heads\.net\/)[^\/]+(\/[^\/]+)(\/nohelm)?/, `$1${part}$2$3`)
    }
    if (menu == "helm") {
      if (part == "yes" && url.endsWith("/nohelm")) {
        url = url.replace("/nohelm", "")
      }
      if (part == "no" && !url.endsWith("/nohelm")) {
        url += "/nohelm"
      }
    }
    embed.setImage(url)
    interaction.update({
      embeds: [embed]
    })
  }
}