import {
  EmbedBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  LabelBuilder,
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
    .setDescription("Report bug or suggestion straight to developer")
    .setIntegrationTypes([0, 1]),
  async execute(interact) {
    const modal = new ModalBuilder()
      .setCustomId("reportbug")
      .setTitle("Report");
    const topics = new StringSelectMenuBuilder()
      .setCustomId("topics")
      .setPlaceholder("Select Topic of Your Report")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Feedback")
          .setDescription("General feedback about the bot")
          .setValue("Feedback"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Suggestion")
          .setDescription("Have a suggestion to make? Select me")
          .setValue("Suggestion"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Report Bug")
          .setDescription("Encountered a bug? Select me")
          .setValue("Report Bug"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Delete Request")
          .setDescription("Request to delete your data from our database")
          .setValue("Delete Request"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Other")
          .setDescription("Any other topic that is not listed")
          .setValue("Other")
      )
    const topicLabel = new LabelBuilder()
      .setLabel("Topics")
      .setStringSelectMenuComponent(topics)
    const message = new TextInputBuilder()
      .setCustomId("message")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMinLength(15)
      .setMaxLength(500)
      .setPlaceholder("Write Your Report Here")
    const messageLabel = new LabelBuilder()
      .setLabel("Report")
      .setTextInputComponent(message)
    modal.addLabelComponents(topicLabel, messageLabel)
    await interact.showModal(modal)
  },
  async modal(interact, client) {
    const {
      colors,
      norme
    } = client.config
    let subject = interact.fields.getStringSelectValues('topics');
    let message = interact.fields.getTextInputValue('message');
    if (!subject || !message || !process.env.REPORT_LOGS) return;
    let channel = await client.channels.fetch(process.env.REPORT_LOGS)
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
      .setDescription(`Bugs sent to the developer!
We'll try to fix it as soon as possible. :D

In mean while please join our server or wait friend request from ihzaq
In this way he can contact you to get more information

Please acknowledge that misused of this commands may result in ban`)
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
      flags: 64
    })
    channel.send({ embeds: [report] })
  }
}