import uuidForName from "../api/mcuuid.js"
import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder
} from "discord.js"
export default {
  cooldown: 6,
  category: "Minecraft Utilities",
  usage: {
    desc: "Grab Minecraft Player skin using Minecraft API"
  },
  data: new SlashCommandBuilder()
    .setName("skin")
    .setDescription("Grab Minecraft Player Skin")
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Put invalid Minecraft Username')
        .setRequired(true)),
  async execute(interaction, client) {
    const { colors, norme } = client.config
    const embedColor = colors.default;
    const errorColor = colors.error;
    const footer = norme.footer
    const username = interaction.options.getString("username")
    let errorMessage = new EmbedBuilder()
      .setTitle("Username Error")
      .setColor(errorColor)
      .setFooter({ text: footer })
      .setDescription("**Minecraft Username Requirements**")
      .addFields(
        { name: 'No Space', value: 'The minecraft username must be one character with no space', inline: true },
        { name: 'Must ASCII letter', value: 'It must 0-9,  all upper/lowercase alphabet and underscore `_`' },
        { name: 'Player didn\'t exist', value: `A player with username ${username} is not exist` },
        { name: '3-16 Character', value: 'Username must be between 3 and 16 character' })
    const uuid = await uuidForName(username)
    if (uuid === null) return await interaction.reply({ ephemeral: true, content: "Hi, At this point, Mojang API maybe down. Please try again later\n-ur mom" });
    if (!uuid) return await interaction.reply({ embeds: [errorMessage], ephemeral: true });
    await interaction.deferReply()
    const download = `https://mc-heads.net/download/${username}`
    const avatar = `https://mc-heads.net/avatar/${uuid.id}`
    const body = `https://mc-heads.net/body/${uuid.id}`
    const head = `https://mc-heads.net/head/${uuid.id}`
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("⬇️")
          .setLabel('Download Skin')
          .setStyle(ButtonStyle.Link)
          .setURL(download),
      );
    const sel = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId(`skin-${interaction.user.id}-${uuid.id}`)
          .setPlaceholder("Choose Part To Preview")
          .addOptions([
            {
              label: "Body",
              description: "Full 3D Representation of the Minecraft Skin",
              emoji: "<:body:1215904407301001216>",
              value: "skin_body"
            },
            {
              label: "Head",
              description: "3D Head of the Minecraft Skin",
              emoji: "<:head:1086303156805308466>",
              value: "skin_head"
            },
            {
              label: "Avatar",
              description: "2D Face of Minecraft Skin",
              emoji: "<:avatar:1086303238883651584>",
              value: "skin_avatar"
            },
            {
              label: "Skin",
              description: "Raw Minecraft Skin Image",
              emoji: "<:skin:1086303320362196992>",
              value: "skin_skin"
            }
          ]),
      );
    let embed = new EmbedBuilder()
      .setColor(embedColor)
      .setFooter({ text: footer })
      .setImage(body)
      .setThumbnail(head)
      .setAuthor({
        name: `${uuid.name}'s skin`,
        iconURL: avatar
      })
      .setDescription(`**UUID**: \`${uuid.id}\``)
    await interaction.editReply({
      embeds: [embed],
      components: [sel, row]
    })
  },
  async selectmenu (interaction, client) {
    const { norme, colors } = client.config
    const [, userid, uuid] = interaction.customId.split("-")
    if (interaction.user.id !== userid) {
      return await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("This is not your skin menu")
          .setDescription(`Create your own using </skin:${client.slashId.get("skin")}>`)
          .setColor(colors.error)
          .setFooter({ text: norme.footer })
        ],
        ephemeral: true
      })
    }

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    const part = interaction.values[0].split("_")[1]
    switch (part) {
      case "body":
        embed.setImage(`https://mc-heads.net/body/${uuid}`)
        break;
      case "head":
        embed.setImage(`https://mc-heads.net/head/${uuid}`)
        break;
      case "avatar":
        embed.setImage(`https://mc-heads.net/avatar/${uuid}`)
        break;
      case "skin":
        embed.setImage(`https://mc-heads.net/skin/${uuid}`)
    }
    interaction.update({
      embeds: [embed]
    })
  }
}