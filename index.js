require("dotenv").config()
/*Express*/
const express = require('express');
/*Discord.js*/
const port = process.env.PORT || process.env.SERVER_PORT || 3000
const token = process.env.TOKEN
const fs = require('fs');
let { 
  Client,
  Collection,
  ActivityType
} = require('discord.js');
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
      name: "/skin | /help for guide"
    }]
  }
})
client.login(token)
client.config = require("./utils/config")
client.app = express()
client.app.get('/', (req, res) => {
  res.send('<title>Skin Stealer Webpage</title>\n<span style="color: red">Skin Stealer</span> Bot are online<br /><a href="https://ihz.carrd.co">Developer</a> <a href="/apidata">API</a>\n<meta name="viewport" content="width=device-width, initial-scale=1.0">');
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
  if(!slash.dev){
    client.slashArray.push(slash.data.toJSON())
    client.slash.set(slash.data.name, slash)
  } else {
    client.slashDevArray.push(slash.data.toJSON())
    client.slashDev.set(slash.data.name, slash)
    continue;
  }
}

fs.readdir('./events/', (err, files) => {
  const eventHandler = require('./handler/eventHandler.js');
  eventHandler(err, files, client);
});