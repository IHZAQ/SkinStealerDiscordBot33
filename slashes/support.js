const { 
  EmbedBuilder,
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle
} = require("discord.js")
module.exports = {
  cooldown: 3,
  category: "General",
  usage: {
    desc: `This command will give you link for our support server, Also you can report bugs/suggestion directly to us by using bugs option which is optional`
  },
  data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Report bug, or suggestion links.")
    .addStringOption(option =>
      option
        .setName("bugs")
        .setDescription("Found any bugs? Tell us.")
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
        .setFooter({text:norme.footer})
      const embed = new EmbedBuilder()
        .setTitle("Report Bug")
        .setDescription("Bugs sent to the developer!\nWe'll try to fix it as soon as possible. :D\nYou might get a friend request from IHZAQ#0485(The Owner) so he could get a more information about it")
        .setColor(colors.default)
        .setFooter({text:norme.footer})
      interact.reply({ embeds: [embed], ephemeral: true })
      channel.send({ embeds: [report] })
    } else {
      await interact.deferReply({ ephemeral: true });
    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Support Server')
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.gg/3d3HBTvfaT"),
      );
    const embed = new EmbedBuilder()
      .setTitle("Report Bug")
      .setDescription("Report Bug? Problems? Suggestion?\nUse Bugs Option to report bugs or join our support server for further help.")
      .setFooter({ text: norme.footer })
      .setColor(colors.default)
    await interact.editReply({
      embeds: [embed],
      components: [button],
      ephemeral: true
    })
    }
  }
}
