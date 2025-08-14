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
    .setDescription("Shows info of the bot like latency, Server count and more.")
    .setIntegrationTypes([0, 1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    await interact.deferReply({ flags: 64 });
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
        { name: 'Credits:', value: "**Bot Avatar made by:**\n" + `> **[Dennisxx2](https://denhis2.carrd.co/)** <:dennisc:805591024118398977>\n> **[ZitzV & Evy](https://discord.gg/2uXnPpFuxM)**\n` + "**Original Idea/Inspired by:**\n" + "> **[Minecraft Skin Stealer - Discord Bot](https://youtu.be/Ja2KFcGG9_I)**" },
        {
          name: 'Thanks to:', value: "> **[MCHeads](https://mc-heads.net) for providing an amazing API for us to use**"
        },
        {
          name: "Useful Links",
          value: `[Support Server](https://discord.gg/3d3HBTvfaT) | [Github Repo](https://github.com/IHZAQ/SkinStealerDiscordBot33) | [Top.gg](https://top.gg/bot/803524726219079690) | [Developer](https://ihz.carrd.co) | [Invite Bot](https://discord.com/api/oauth2/authorize?client_id=${client.user.id})`
        }
      )
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
      .setThumbnail(client.user.displayAvatarURL())
    await interact.editReply({
      embeds: [embed]
    })
  }
}