function s(num) {
  var s = num + "";
  while (s.length < 2) s = "0" + s;
  return s;
}
import {
  EmbedBuilder,
  SlashCommandBuilder
} from "discord.js"

export default {
  cooldown: 5,
  category: "General",
  usage: {
    desc: "Shows info of the bot like latency, Server count and more."
  },
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Shows info of the bot like latency, Server count and more."),
  async execute(interact, client) {
    const { norme, colors } = client.config
    await interact.deferReply({ ephemeral: true });
    let days = Math.floor(client.uptime / 86400000);
    let hours = Math.floor(client.uptime / 3600000) % 24;
    let minutes = Math.floor(client.uptime / 60000) % 60;
    let seconds = Math.floor(client.uptime / 1000) % 60;
    let uptime = `${s(days)}d:${s(hours)}h:${s(minutes)}m:${s(seconds)}s`;
    const ping = Math.round(client.ws.ping);
    const embed = new EmbedBuilder()
      .setTitle("**Info**")
      .setDescription("Here a few information about this bot")
      .addFields(
        { name: 'Bots itself:', value: client.user.toString(), inline: true },
        { name: 'Creator/Founder:', value: `**[IHZAQ](https://ihz.carrd.co)** <:Ihzaqstorm33_head:721731760601170000>`, inline: true },
        { name: 'Ping:', value: `**\`${ping}ms\`**`, inline: false },
        { name: 'Uptime:', value: `**\`${uptime}\`**`, inline: true },
        { name: 'Server count:', value: `**\`${client.guilds.cache.size} servers\`**` },
        { name: 'Credits:', value: "**Bot Avatar made by:**\n" + `> **[Dennisxx2](https://denhis2.carrd.co/)** <:dennisc:805591024118398977>\n> **[ZitzV 💀 & Evy <:trollface:947484233197305867>](https://discord.gg/2uXnPpFuxM)**\n` + "**Original Idea/Inspired by:**\n" + "> **[Minecraft Skin Stealer - Discord Bot](https://youtu.be/Ja2KFcGG9_I)**" },
        {
          name: 'Thanks to:', value: "> **[Crafatar](https://crafatar.com) and [Minotar](https://minotar.net) for providing an amazing API for us to use**\n" +
            "> **[SkinMC](https://skinmc.net) for providing Minecraft Achievements API**"
        }
      )
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
      .setThumbnail('https://cdn.discordapp.com/avatars/803524726219079690/b69a2f277cbf43b9025ee10842a39b78.png?size=512&ignore=true')
    await interact.editReply({
      embeds: [embed],
      ephemeral: true
    })
  }
}