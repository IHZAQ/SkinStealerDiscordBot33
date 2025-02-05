import {
  EmbedBuilder,
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle
} from "discord.js"
const isASCII = (str) => /^[\x00-\x7F]*$/.test(str);
export default {
  cooldown: 3,
  category: "Minecraft Utilities",
  usage: {
    desc: "Use this command to grab skin from [TLauncher](https://tlauncher.org/en/catalog/skins/nickname/) which is free platform to upload your skin"
  },
  data: new SlashCommandBuilder()
    .setName("tlskin")
    .setDescription("Just like skin command but this take a skin from TLauncher.")
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Put invalid Minecraft username')
        .setRequired(true))
    .setIntegrationTypes([0,1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    const username = interact.options.getString("username")
    let fullArgs = encodeURI(username);
    const ascii = isASCII(fullArgs);
    const body = `https://tlauncher.org/skin.php?username_catalog=nickname&username_file=tlauncher_${fullArgs}.png&`
    const skin = `https://tlauncher.org/upload/all/nickname/tlauncher_${fullArgs}.png`
    let embed = new EmbedBuilder()
      .setColor(colors.default)
      .setFooter({ text: norme.footer })
      .setImage(body)
      .setAuthor({ name: `TLauncher ${username}'s skin`, iconURL: "https://tlauncher.org/apple-touch-icon.png", })
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("⬇️")
          .setLabel('Download Skin')
          .setStyle(ButtonStyle.Link)
          .setURL(skin),
      );
    let notAscii = client.embErr("You can only do 0-9 and uppercase/lowercase letter as username.")
    if (ascii) {
      await interact.deferReply()
      await interact.editReply({
        embeds: [embed],
        components: [row]
      })
    } else {
      await interact.deferReply({ flags: 64 })
      await interact.editReply({ embeds: [notAscii], flags: 64 })
    }
  }
}