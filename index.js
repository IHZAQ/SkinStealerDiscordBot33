require("dotenv").config()
/*Express*/
const express = require('express');
const app = express();
app.get('/', (req, res) => {
	res.send('Skin Stealer Bot are online');
  res.status(200)
});

app.listen(process.env.PORT, () => {
	console.log('Bot is ready to online');
});
/*Discord.js*/
const token = process.env.TOKEN;
const prefixdb = process.env.PREFIX_DB;
const fs = require('fs');
let Discord = require('discord.js');
let client = new Discord.Client({
	intents: 32767
});
client.on('ready', async () => {
  app.get('/apidata', async (req, res) => {
    let data = {
      serverCount: client.guilds.cache.size,
      userCount: client.users.cache.size
    }
    res.json(data)
  })
  client.user.setActivity('st!help | mention for help', { type: 'PLAYING' })
})
client.login(token);
/*Discord fs*/
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slashes = new Discord.Collection();
const slashFiles = fs.readdirSync("./slashes").filter(file => file.endsWith(".js"));
client.sla = []
for(const file of slashFiles){
  const slash = require(`./slashes/${file}`)
  client.sla.push(slash.data.toJSON())
  client.slashes.set(slash.data.name, slash)
}

fs.readdir('./events/', (err, files) => {
	const eventHandler = require('./handler/eventHandler.js');
	eventHandler(err, files, client);
});
fs.readdir('./commands/', (err, files) => {
	const commandHandler = require('./handler/commandHandler.js');
	commandHandler(err, files, client);
});
ds/', (err, files) => {
	const commandHandler = require('./handler/commandHandler.js');
	commandHandler(err, files, client);
});
