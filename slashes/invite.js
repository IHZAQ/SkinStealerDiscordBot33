const { norme, colors } = require("../utils/config")
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, ButtonComponent } = require("discord.js")
module.exports = {
  cooldown: 3,
  usage: {
    desc: "Show invite links for this bot",
    id: "939411396439990374"
  },
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Show invite links for this bot"),
  async execute(interact) {
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setEmoji("❤")
          .setLabel("Add me to your server")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/oauth2/authorize?client_id=803524726219079690&permissions=274878118976&scope=bot%20applications.commands")
      )
    await interact.reply({ components: [row], ephemeral: true })
  }
}
