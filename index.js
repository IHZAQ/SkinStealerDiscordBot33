require("dotenv").config()
/*Express*/
const express = require('express');
/*Discord.js*/
const port = process.env.PORT || process.env.SERVER_PORT || 3000
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
client.login(process.env.TOKEN)
client.config = require("./utils/config")
client.app = express()
client.app.get('/', (req, res) => {
  res.send('<title>Skin Stealer Webpage</title>\n<span style="color: red">Skin Stealer</span> Bot are online\n<a href="https://ihz.carrd.co">Developer</a> <a href="/apidata">API</a>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  res.status(200)
});
client.app.listen(port, () => {
  console.log('Bot is ready to online!');
});
client.rest.on("rateLimited", () => {
  console.log("helo u got ratelimit haha")
})
/*Discord fs*/

client.slash = new Collection();
client.slashArray = []  

client.slashDev = new Collection()
client.slashDevArray = []

client.names = []
const slashFiles = fs.readdirSync("./slashes").filter(file => file.endsWith(".js"));
for (const file of slashFiles) {
  const slash = require(`./slashes/${file}`)
  const subcommand = slash.data.options.filter(e => !e.type).map(e => e.name)
  
  if(!slash.dev){
    client.slashArray.push(slash.data.toJSON())
    client.slash.set(slash.data.name, slash)
  } else {
    client.slashDevArray.push(slash.data.toJSON())
    client.slashDev.set(slash.data.name, slash)
    continue;
  }
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