import { java, bedrock } from "../api/mcuuid.js"
import {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder
} from "discord.js"
import emoji from "../data/emoji.js"

export default {
  cooldown: 6,
  category: "Minecraft Utilities",
  usage: {
    java: "Grab Minecraft Java Player Skin",
    bedrock: "Grab Minecraft Bedrock Player Skin"
  },
  data: new SlashCommandBuilder()
    .setName("skin")
    .setDescription("Grab Minecraft Player Skin")
    .addSubcommand(command =>
      command
        .setName("java")
        .setDescription("Grab Minecraft Java Player Skin")
        .addStringOption(option =>
          option.setName('username')
            .setDescription('Enter a valid Minecraft Java Username')
            .setRequired(true))
    )
    .addSubcommand(command =>
      command
        .setName("bedrock")
        .setDescription("Grab Minecraft Bedrock Player Skin")
        .addStringOption(option =>
          option.setName('username')
            .setDescription('Enter a valid Minecraft Bedrock Username')
            .setRequired(true))
    )
    .setIntegrationTypes([0, 1]),
  async execute(interaction, client) {
    await interaction.deferReply({ flags: 64 });
    const subcommand = interaction.options.getSubcommand()
    const isJava = subcommand === "java"
    const uuidForName = isJava ? java : bedrock;
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
        { name: 'Must ASCII letter', value: 'It must 0-9, all upper/lowercase alphabet and underscore `_`' },
        { name: 'Player didn\'t exist', value: `A player with username ${username} does not exist` },
        { name: '3-16 Character', value: 'Username must be between 3 and 16 characters' });
    if (!isJava) errorMessage.addFields({ name: "Geyser Bedrock", value: `For Bedrock players who have never joined any Geyser server before, click [HERE](${process.env.SERVER_URL}/mcs/GeyserTestServer/test.geysermc.org/19132). We need you to connect at least once so our database can register your account!` });
    const uuid = await uuidForName(username)
    if (uuid === null) return await interaction.editReply({ embeds: [client.embErr("Hi, At this point, Mojang API maybe down. Please try again later")] });
    if (!uuid) return await interaction.editReply({ embeds: [errorMessage] });

    const download = `${process.env.SERVER_URL}/downloadSkin/${uuid.id}/${uuid.name || uuid.id}`
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
          .setCustomId(`skin-${interaction.user.id}`)
          .setPlaceholder("Choose Part To Preview")
          .addOptions([
            {
              label: "Body (Right)",
              description: "Full 3D Representation of the Minecraft Skin",
              emoji: emoji("body"),
              value: "skin_body_right"
            },
            {
              label: "Body (Left)",
              description: "Full 3D Representation of the Minecraft Skin",
              emoji: emoji("bodyleft"),
              value: "skin_body_left"
            },
            {
              label: "Full Body",
              description: "Full 2D Representation of the Minecraft Skin",
              emoji: emoji("papercraft"),
              value: "skin_player"
            },
            {
              label: "Head (Right)",
              description: "3D Head of the Minecraft Skin",
              emoji: emoji("head"),
              value: "skin_head_right"
            },
            {
              label: "Head (Left)",
              description: "3D Head of the Minecraft Skin",
              emoji: emoji("headleft"),
              value: "skin_head_left"
            },
            {
              label: "Avatar",
              description: "2D Face of Minecraft Skin",
              emoji: emoji("avatar"),
              value: "skin_avatar"
            },
            {
              label: "Skin",
              description: "Raw Minecraft Skin Image",
              emoji: emoji("skin"),
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

    let embed = new EmbedBuilder()
      .setColor(embedColor)
      .setFooter({ text: footer })
      .setImage(body)
      .setThumbnail(head)
      .setAuthor({
        name: `${uuid.name}'s ${isJava ? "Java" : "Bedrock"} Skin`,
        iconURL: avatar
      })
      .setDescription(`**${isJava ? "UUID" : "XUID"}**: \`${isJava ? uuid.id : uuid.xuid}\``)
    await interaction.editReply({
      content: "You may close this message"
    })
    await interaction.followUp({
      embeds: [embed],
      components: [sel, row],
      ...client.checkPerms(interaction)
    })
  },

  async selectmenu(interaction, client) {
    const { norme, colors } = client.config
    const [, userid] = interaction.customId.split("-")

    if (interaction.user.id !== userid) {
      return await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("This is not your skin menu")
          .setDescription(`Create your own using </skin:${client.slashId.get("skin")}>`)
          .setColor(colors.error)
          .setFooter({ text: norme.footer })
        ],
        flags: 64
      })
    }

    const embed = EmbedBuilder.from(interaction.message.embeds[0])
    let url = interaction.message.embeds[0].image.url
    const [menu, part, direction] = interaction.values[0].split("_")

    if (menu === "skin") {
      const match = url.match(/(https:\/\/mc-heads\.net\/)[^\/]+\/([^\/]+)/);
      if (match) {
        const baseUrl = match[1];
        const uuid = match[2];
        const hasNoHelm = url.endsWith("/nohelm");
        url = `${baseUrl}${part}/${uuid}`;

        if (["head", "body"].includes(part) && direction) {
          url += `/${direction}`;
        }
        if (hasNoHelm) {
          url += "/nohelm";
        }
      }
    }

    if (menu === "helm") {
      if (part === "yes" && url.endsWith("/nohelm")) {
        url = url.replace("/nohelm", "")
      }
      if (part === "no" && !url.endsWith("/nohelm")) {
        url += "/nohelm"
      }
    }

    embed.setImage(url)
    interaction.update({
      embeds: [embed]
    })
  }
}