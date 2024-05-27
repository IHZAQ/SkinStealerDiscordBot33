import {
  REST,
  Events,
  Routes
} from "discord.js"
import mongoose from "mongoose"
export default {
  event: Events.ClientReady,
  once: true,
  run: async (client) => {
    client.app.get("/icon", async (req, res) => {
      res.redirect(client.user.displayAvatarURL());
    })
    client.app.get('/apidata', async (req, res) => {
      let data = {
        serverCount: client.guilds.cache.size,
        uptime: client.uptime,
        id: client.user.id
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
        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: client.slashArray
        })
        client.slashId = new Map(data.map(e => [e.name, e.id]))
        rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), { body: client.slashDevArray }).then(() => {
          console.log("Successfully registered command locally")
        })
        console.log("Succesfully registered command globally")
      } catch (err) {
        if (err) console.log(err);
        console.log("The provided server id is not valid, please invite the bot to the server")
      }
    })()
    await mongoose.connect(process.env.MONGO)
    console.log("MongoDB Successfully Connected")
  }
};