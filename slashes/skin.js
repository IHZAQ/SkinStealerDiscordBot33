import uuidForName from "../api/mcuuid.js"
import {
  EmbedBuilder,
  ActionRowBuilder,
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
    const download = `https://minotar.net/download/${username}`
    const avatar = `https://crafatar.com/avatars/${uuid.id}?overlay=true`
    const body = `https://crafatar.com/renders/body/${uuid.id}?overlay=true`
    const head = `https://crafatar.com/renders/head/${uuid.id}?overlay=true`
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("⬇️")
          .setLabel('Download Skin')
          .setStyle(ButtonStyle.Link)
          .setURL(download),
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
    await interaction.editReply({
      embeds: [embed],
      components: [row]
    })
  }
}