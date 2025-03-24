import {
  EmbedBuilder,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder
} from "discord.js"
import tlauncher from "../api/tlauncher.js";
import emoji from "../data/emoji.js"
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
    .setIntegrationTypes([0, 1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    const username = interact.options.getString("username")
    const body = await tlauncher(username);
    let notExist = client.embErr("This user did not exist")
    if (!body) return interact.reply({
      embeds: [notExist],
      flags: 64
    });
    await interact.deferReply(client.checkPerms(interact));
    const img = new AttachmentBuilder(body, {
      name: "body.png"
    })
    const skin = `https://tlauncher.org/catalog/nickname/download/tlauncher_${encodeURI(username)}.png`
    let embed = new EmbedBuilder()
      .setColor(colors.default)
      .setFooter({ text: norme.footer })
      .setImage("attachment://body.png")
      .setTitle(`${emoji("tlauncher")} TLauncher ${username}'s skin`)
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("⬇️")
          .setLabel('Download Skin')
          .setStyle(ButtonStyle.Link)
          .setURL(skin),
      );
    await interact.editReply({
      embeds: [embed],
      components: [row],
      files: [img]
    })
  }
}