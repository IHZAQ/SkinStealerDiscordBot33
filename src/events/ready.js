import {
  REST,
  Events,
  Routes
} from "discord.js"
import mongoose from "mongoose"
const log = (e) => console.log(`\x1b[32m${e}\x1b[0m`);
const logErr = (e) => console.log(`\x1b[31m${e}\x1b[0m`);
export default {
  event: Events.ClientReady,
  once: true,
  run: async (client) => {
    client.app.get("/icon", async (req, res) => {
      let str = ""
      if (req.query.size) str += `?size=${req.query.size}`;
      res.redirect(client.user.displayAvatarURL() + str);
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
    log(`Bot is online!: ${client.user.tag}`);
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
          log("Successfully registered command locally")
        })
        log("Succesfully registered command globally")
      } catch (err) {
        if (err) console.log(err);
        logErr("The provided server id is not valid, please invite the bot to the server")
      }
    })()
    await mongoose.connect(process.env.MONGO)
    log("MongoDB Successfully Connected")
  }
};