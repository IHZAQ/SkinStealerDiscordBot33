require("dotenv").config()
/*Express*/
const express = require('express');
const app = express();
/*Discord.js*/
const token = process.env.TOKEN;
const fs = require('fs');
let { Client, Collection, ActivityType } = require('discord.js');
let client = new Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent"
  ],
  presence: {
    status: "online",
    activities: [{
      type: ActivityType.Playing,
      name: "/help | /support for help"
    }]
  }
})
client.app = express()
client.app.get('/', (req, res) => {
  res.send('<span style="color: red">Skin Stealer</span> Bot are online');
  res.status(200)
});

client.app.listen(process.env.PORT, () => {
  console.log('Bot is ready to online!');
});
client.rest.on("rateLimited", () => {
  console.log("Imagine got ratelimit")
})
client.login(token);
/*Discord fs*/

client.slashes = new Collection();
client.names = []
const slashFiles = fs.readdirSync("./slashes").filter(file => file.endsWith(".js"));
client.sla = []
for (const file of slashFiles) {
  const slash = require(`./slashes/${file}`)
  const subcommand = slash.data.options.filter(e => !e.type).map(e => e.name)
  client.sla.push(slash.data.toJSON())
  client.slashes.set(slash.data.name, slash)
  if (!subcommand.length) {
    client.names.push(slash.data.name)
  } else {
    subcommand.forEach(n => {
      client.names.push(`${slash.data.name} ${n}`)
    })
  }
}

fs.readdir('./events/', (err, files) => {
  const eventHandler = require('./handler/eventHandler.js');
  eventHandler(err, files, client);
});