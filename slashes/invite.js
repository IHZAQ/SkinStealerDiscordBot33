const { 
  ButtonBuilder,
  ActionRowBuilder, 
  ButtonStyle,
  SlashCommandBuilder
} = require("discord.js")
module.exports = {
  cooldown: 3,
  category: "General",
  usage: {
    desc: "Show invite links for this bot"
  },
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Show invite links for this bot"),
  async execute(interact, client) {
    const { norme, colors } = client.config
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("❤")
          .setLabel("Add me to your server")
          .setStyle(ButtonStyle.Link)
          .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=274878118976&scope=bot%20applications.commands`)
      )
    await interact.reply({ components: [row], ephemeral: true })
  }
}
