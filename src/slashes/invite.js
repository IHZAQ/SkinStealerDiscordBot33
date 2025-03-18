import {
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
  SlashCommandBuilder
} from "discord.js"
export default {
  category: "General",
  usage: {
    desc: "Show invite links for this bot"
  },
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Show invite links for this bot")
    .setIntegrationTypes([0, 1]),
  async execute(interact, client) {
    const { norme, colors } = client.config
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("🏡")
          .setLabel("Add to Server")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=313344&scope=bot%20applications.commands`),
        new ButtonBuilder()
          .setEmoji("🚹")
          .setLabel("Add to My Apps")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&integration_type=1&scope=applications.commands`)
      )
    await interact.reply({
      components: [row],
      flags: 64
    })
  }
}
