import { 
  EmbedBuilder,
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle
} from "discord.js"
export default {
  cooldown: 3,
  category: "General",
  usage: {
    desc: `You can report bugs/suggestion directly to us`
  },
  data: new SlashCommandBuilder()
    .setName("reportbug")
    .setDescription("Report bug or suggestion straight to developer")
    .addStringOption(option =>
      option
        .setName("bugs")
        .setDescription("Found any bugs? Tell us.")
        .setRequired(true)
      ),
  async execute(interact, client) {
    const { 
      norme,
      colors, 
      channels: { reportlogs }
    } = client.config
    let bugs = interact.options.getString("bugs")
    if(bugs && reportlogs){
      let channel = await client.channels.fetch(reportlogs)
      let member = interact.user
      const report = new EmbedBuilder()
        .setTitle(`${member.username} Reported:`)
        .setDescription(`\`${bugs}\``)
        .addFields(
          { name: "Full tag:", value: `\`${member.tag}\``, inline: true },
          { name: "User Id:", value: `\`${member.id}\``, inline: true }
        )
        .setColor(colors.default)
        .setFooter({ text: norme.footer })
      const embed = new EmbedBuilder()
        .setTitle("Report Bug")
        .setDescription("Bugs sent to the developer!\nWe'll try to fix it as soon as possible. :D\nYou might get a friend request from IHZAQ#0485(The Owner) so he could get a more information about it")
        .setColor(colors.default)
        .setFooter({ text: norme.footer })
      const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Join Our Server')
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/3d3HBTvfaT"),
      );
      interact.reply({ 
        embeds: [embed],
        components: [button],
        ephemeral: true
      })
      channel.send({ embeds: [report] })
    }
  }
}
