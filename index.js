/*Express*/
const express = require("express")
const app = express()
const server = app.get("/", (req, res) => {
  res.send("Skin Stealer Bot are online")
})

app.listen(3000, () => {
  console.log("Bot is ready to online")
})
/*Discord.js*/
const token = process.env.TOKEN
const prefixdb = process.env['PREFIX_DB']
const { prefix } = require("./utils/config.json")

let Discord = require("discord.js")
let client = new Discord.Client({
  intents: 32767
})
const mongoose = require("mongoose")


mongoose.connect(prefixdb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

client.on('ready', async () => {
  client.user.setPresence({
    status: 'online',
    activities: [{
      name: `to ${prefix}help | mention for help`,
      type: 'LISTENING',
    }]
  })
})

client.login(token)
/*Discord fs*/
const fs = require('fs');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashCommands = new Discord.Collection();

fs.readdir('./events/', (err, files) => {
  const eventHandler = require('./handler/eventHandler.js');
  eventHandler(err, files, client);
});
fs.readdir('./commands/', (err, files) => {
  const commandHandler = require('./handler/commandHandler.js');
  commandHandler(err, files, client);
});