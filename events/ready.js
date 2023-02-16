const { REST, Events, Routes } = require("discord.js")
module.exports = {
  event: Events.ClientReady,
  once: true,
  run: async (client) => {
    client.app.get('/apidata', async (req, res) => {
      let data = {
        serverCount: client.guilds.cache.size,
        userCount: client.users.cache.size
      }
      res.json(data)
    })
    console.clear()
    console.log(`Bot is online!: ${client.user.tag}`);
    const CLIENT_ID = client.user.id;
    const rest = new REST({
      version: "10"
    }).setToken(process.env.TOKEN);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: client.sla
        })
        console.log("Succesfully registered command globaly")
      } catch (err) {
        if (err) console.log(err);
      }
    })()
  },
};
