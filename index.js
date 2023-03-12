import {
  Client,
  Collection,
  ActivityType
} from "discord.js"
import express from "express"
import { readdirSync } from 'fs'
import { config as envig } from "dotenv"
import config from "./utils/config.js"
import eventHandler from './handler/eventHandler.js'
import commandHandler from './handler/commandHandler.js'
envig()

const port = process.env.PORT || process.env.SERVER_PORT || 3000
const token = process.env.TOKEN

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
client.config = config
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

client.slash = new Collection();
client.slashArray = []  

client.slashDev = new Collection()
client.slashDevArray = []

client.names = []
const filter = file => file.endsWith(".js");

const command = readdirSync("./slashes/").filter(filter)
commandHandler(command, client) 

const event = readdirSync('./events/').filter(filter)
eventHandler(event, client)