import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder
} from "discord.js"
import converter from "../data/converter.js"

export default {
  cooldown: 60,
  category: "Fun / Utilities",
  usage: {
    desc: "Turns your Minecraft skin into Roblox shirt and pants!"
  },
  data: new SlashCommandBuilder()
    .setName("mc2rblx")
    .setDescription("Turns your Minecraft skin into Roblox shirt and pants!")
    .addAttachmentOption(option =>
      option.setName("skin")
        .setDescription("Upload your Minecraft Skin")
        .setRequired(true))
    .setIntegrationTypes([0, 1]),
  execute: async (interaction, { embErr, config: { norme, colors }, checkPerms }) => {
    const { url, contentType } = interaction.options.getAttachment("skin")
    if (!contentType.startsWith("image")) return interaction.reply({
      embeds: [embErr("The file you uploaded was not an image.")],
      flags: 64
    });
    await interaction.deferReply(checkPerms(interaction))
    const data = await converter(url, contentType);
    if (!data) return interaction.editReply({
      embeds: [embErr("Only image with the size of 64 x 64 will be accepted.\n* Legacy is not supported")]
    });
    const shirt = new AttachmentBuilder(data[0], {
      name: "shirt.png"
    });
    const pants = new AttachmentBuilder(data[1], {
      name: "pants.png"
    })
    const embed1 = new EmbedBuilder()
      .setTitle("Minecraft skin to Roblox avatar converter")
      .setDescription("**Shirt**")
      .setImage("attachment://shirt.png")
      .setColor(colors.default)
    const embed2 = new EmbedBuilder()
      .setDescription("**Pants**")
      .setImage("attachment://pants.png")
      .setColor(colors.default)
      .setFooter({ text: norme.footer })
    interaction.editReply({
      embeds: [embed1, embed2],
      files: [shirt, pants]
    })
  }
}