import { 
  EmbedBuilder,
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from "discord.js"
export default {
  cooldown: 3,
  category: "General",
  usage: {
    desc: `You can report bugs/suggestion directly to us`
  },
  data: new SlashCommandBuilder()
    .setName("reportbug")
    .setDescription("Report bug or suggestion straight to developer"),
  async execute(interact) {
    const modal = new ModalBuilder()
      .setCustomId("reportbug")
      .setTitle("Feedback / Suggestion / Bugs");
    const subject = new TextInputBuilder()
      .setCustomId("subject")
      .setLabel("Subject")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(3)
      .setMaxLength(20)
      .setPlaceholder("The Main Topic Here");
    const message = new TextInputBuilder()
      .setCustomId("message")
      .setLabel("Your Message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(15)
      .setMaxLength(500)
      .setPlaceholder("Write Your Report Here");
    modal.addComponents(
      (new ActionRowBuilder().addComponents(subject)),
      (new ActionRowBuilder().addComponents(message))
    )
    await interact.showModal(modal)
  },
  async modal(interact, client) {
    const { 
      channels: { reportlogs },
      colors,
      norme
    } = client.config
    let subject = interact.fields.getTextInputValue('subject');
    let message = interact.fields.getTextInputValue('message');
    if(!subject || !message || !reportlogs) return;
    let channel = await client.channels.fetch(reportlogs)
    let member = interact.user
    const report = new EmbedBuilder()
      .setTitle(`${member.username} Reported:`)
      .setAuthor({
        name: member.username,
        iconURL: member.displayAvatarURL(),
        url: `https://discord.com/users/${member.id}`
      })
      .setDescription(`
# ${subject}
\`\`\`${message}\`\`\`
`)
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