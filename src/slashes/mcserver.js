import {
  EmbedBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonStyle
} from "discord.js"
import axios from "axios"

export default {
  cooldown: 8,
  category: "Minecraft Utilities",
  usage: {
    java: "Fetch an information from Minecraft Server Java",
    bedrock: "Fetch an information from Minecraft Server Bedrock"
  },
  data: new SlashCommandBuilder()
    .setName("mcserver")
    .setDescription("Fetch Minecraft Server Information which support both Bedrock and Java")
    .addSubcommand(command =>
      command
        .setName("java")
        .setDescription("Minecraft Java Server")
        .addStringOption(option =>
          option.setName("ip")
            .setDescription("Ip of the server")
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName("port")
            .setDescription("Port (default: 25565)")
            .setMinValue(1)
            .setMaxValue(65535)
        )
    )
    .addSubcommand(command =>
      command
        .setName("bedrock")
        .setDescription("Minecraft Bedrock Server")
        .addStringOption(option =>
          option.setName("ip")
            .setDescription("Ip of the server")
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName("port")
            .setDescription("Port (default: 19132)")
            .setMinValue(1)
            .setMaxValue(65535)
        )

    )
    .setIntegrationTypes([0, 1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    await interact.deferReply({
      flags: 64
    })
    const errore = new EmbedBuilder()
      .setTitle("Error")
      .setDescription("**There could be only 2 reasons**")
      .addFields({
        name: "Invalid IP or PORT",
        value: "You probably mess up the ip and port format"
      }, {
        name: "The server didn't exist or offline",
        value: "Pretty much straightforward"
      })
      .setColor(colors.error)

    function p(prt, defalt) {
      if (prt && prt > 0 && prt <= 65535) {
        return prt
      } else {
        return defalt
      }
    }
    const ip = interact.options.getString("ip")
    const port = parseInt(interact.options.getInteger("port"))
    if (interact.options.getSubcommand() === "java") {
      const por = p(port, 25565)
      const mc = async () => {
        try {
          const {
            data
          } = await axios.get(`https://api.mcstatus.io/v2/status/java/${ip}:${por}`).catch(err => {
            return undefined
          })
          return {
            motd: data.motd.clean,
            version: data.version.name_clean,
            players: `${data.players.online}/${data.players.max}`,
            favicon: data.icon,
            list: data.players.list || undefined
          }
        } catch (err) {
          return undefined
        }
      }
      const info = await mc()
      if (!info) return await interact.editReply({
        embeds: [errore],
        flags: 64
      });

      let image;
      const publish = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId(`s-mcserver`)
            .setLabel("Publish")
            .setStyle(ButtonStyle.Primary)
        )
      const embed = new EmbedBuilder()
        .setTitle("Minecraft Java Server")
        .addFields({
          name: "Ip:Port",
          value: `**\`${ip}:${por}\`**`
        }, {
          name: "Motd",
          value: info.motd
        }, {
          name: "Version",
          value: info.version
        }, {
          name: "Players Counts",
          value: info.players
        })
        .setColor(colors.default)
        .setFooter({
          text: norme.footer
        })
      if (info.list && info.length) {
        const player = info.length.map((e) => e.name_raw).join(`\n`)
        embed.addFields({
          name: "Players",
          value: player
        })
      }
      if (info.favicon) {
        const img = new Buffer.from(info.favicon.split(",")[1], "base64");
        image = new AttachmentBuilder(await img, {
          name: "favicon.png"
        })
        embed.setThumbnail(`attachment://favicon.png`)
      }
      let content = {
        embeds: [embed],
        components: client.checkPerms(interact, true) ? [publish] : []
      }
      if (image) {
        content.files = [image]
      }
      await interact.editReply(content)
    }
    if (interact.options.getSubcommand() === "bedrock") {
      let por = p(port, 19132)
      const mcpe = async () => {
        try {
          const {
            data
          } = await axios.get(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${por}`)
          return {
            motd: data.motd.clean,
            version: data.version.name,
            gamemode: data.gamemode,
            players: `${data.players.online}/${data.players.max}`
          }
        } catch (error) {
          return undefined
        }
      }
      const info = await mcpe()
      if (!info) return await interact.editReply({
        embeds: [errore]
      });
      let url = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setEmoji("<:minecraft:1286196639521968140>")
            .setLabel('Open in Minecraft')
            .setStyle(ButtonStyle.Link)
            .setURL(`{your url here}/mcs/${encodeURI(info.motd.split(`\n`)[0])}/${ip}/${por}`))
      if (client.checkPerms(interact, true)) url.addComponents(new ButtonBuilder()
        .setCustomId(`s-mcserver-bedrock`)
        .setLabel("Publish")
        .setStyle(ButtonStyle.Primary));
      const embed = new EmbedBuilder()
        .setTitle("Minecraft Bedrock Server")
        .addFields({
          name: "Ip:Port",
          value: `**\`${ip}:${por}\`**`
        }, {
          name: "Motd",
          value: info.motd || "No Motd given"
        }, {
          name: "Version",
          value: info.version || "Unknown"
        }, {
          name: "Gamemode",
          value: info.gamemode || "unknown"
        }, {
          name: "Players Count",
          value: info.players || "unknown"
        })
        .setColor(colors.default)
        .setFooter({
          text: norme.footer
        })
      await interact.editReply({
        embeds: [embed],
        components: [url]
      })
    }

  },
  async button(interact) {
    let embed = EmbedBuilder.from(interact.message.embeds[0])
    const guild = interact.inGuild()
    const authorname = guild ? `/mcserver by ${interact.user.tag}` : "/mcserver by you";
    embed.setAuthor({
      name: authorname,
      iconURL: interact.user.avatarURL()
    })
    let content = {
      embeds: [embed]
    }
    if (interact.customId.split(`-`)[2]) {
      let component = new ActionRowBuilder()
        .addComponents(interact.message.components[0].components[0])
      content.components = [component]
    }
    if (guild) {
      await interact.channel.send(content)
    } else {
      await interact.user.send(content)
    }
    interact.update({
      content: "The Embed Was Published",
      components: [],
      embeds: [],
      files: []
    })
  }
}