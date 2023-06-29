import {
  REST,
  Events,
  Routes
} from "discord.js"
export default {
  event: Events.ClientReady,
  once: true,
  run: async (client) => {
    client.app.get('/apidata', async (req, res) => {
      let data = {
        serverCount: client.guilds.cache.size,
        uptime: client.uptime
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
        client.slashId = new Map(data.map((e) => [e.name, e.id]))
        if(client.config.guild_id && client.slashDevArray.length){
          await rest.put(Routes.applicationGuildCommands(CLIENT_ID,client.config.guild_id), {
            body: client.slashDevArray
          })
        }
        console.log("Succesfully registered command globaly")
      } catch (err) {
        if (err) console.log(err);
      }
    })()
  },
};
