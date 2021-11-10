/*Express*/
const express = require("express")
const app = express()
app.get("/", (req, res) =>{
  res.send("Hello Hell!")
})

app.listen(3000, () =>{
  console.log("Bot is ready to online")
})
/*Discord.js*/
const token = process.env['TOKEN']

let Discord = require("discord.js")
let client = new Discord.Client()
const { prefix } = require("./utils/config.json")

client.on('ready', async () =>{
  client.user.setPresence({
    status: 'online',
    activity: {
        name: `to ${prefix}help`,
        type: 'LISTENING',
    }
  })
})
client.login(token)
/*Discord fs*/
const fs = require('fs');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./events/', (err, files) => {
	const eventHandler = require('./handler/eventHandler.js');
	eventHandler(err, files, client);
});
fs.readdir('./commands/', (err, files) => {
	const commandHandler = require('./handler/commandHandler.js');
	commandHandler(err, files, client);
});
/*welcome and bye */