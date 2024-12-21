import {
  SlashCommandBuilder, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle
} from "discord.js"
import getUser from "../api/xboxuser.js"
export default {
  cooldown: 12,
  usage: {
    player: "Fetch Xbox Live Player Information"
  }, 
  category: "Xbox Live", 
  data: new SlashCommandBuilder()
    .setName("xbox")
    .setDescription("Xbox Live Useful Commands")
    .addSubcommand(command =>
      command
        .setName("player")
        .setDescription("Fetch Xbox Live Player Information")
        .addStringOption(option =>
          option.setName("gamertag")
            .setDescription("Gamertag of Xbox Live Users")
            .setRequired(true)
        )
    ),
  async execute(interaction, client){
    const {
      colors, 
      norme
    } = client.config
    await interaction.deferReply()
    const gamertag = interaction.options.getString("gamertag")
    const info = await getUser(gamertag.toLowerCase())
    const errorEmbed = client.embErr("The player you are trying to find did not exist, try another gamertag")
    if(!info) return interaction.editReply({ embeds: [errorEmbed] });
    let color = info.color ? info.color : colors.default;
    if(color === "107c10") color = colors.default;
    const embed = new EmbedBuilder()
      .setTitle(`${info.name}'s Profile`)
      .setAuthor({
        name: "Xbox Live Gamers"
      }) 
      .addFields(
        {
          name: "Follower/Following Count", 
          value: `> Follower: ${info.followerCount}\n> Following: ${info.followingCount}`
        },
        {
          name: "Gamerscore", 
          value: `**${info.gamerscore}** <:gamerscore:1286196597390049290>`
        }, 
        {
          name: "XUID", 
          value: `\`${info.xuid}\``
        }
      )
      .setThumbnail(info.avatarURL)
      .setColor(color)
      .setFooter({ text: norme.footer })
    let row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setEmoji("👤")
        .setLabel('Gamers Profile')
        .setStyle(ButtonStyle.Link)
        .setURL(`https://account.xbox.com/en-gb/profile?gamertag=${info.name}`),
    );
    if(info.realname) {
      embed.addFields({
        name: "Real Name", 
        value: info.realname
      })
    }
    await interaction.editReply({
      embeds: [embed], 
      components: [row]
    })
  }
}