import {
  Client,
  ActivityType,
  Collection,
  GatewayIntentBits
} from "discord.js"
import { readdirSync } from 'fs'
import { config } from "dotenv"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from "express"
import fig from "./utils/config.js"
import eventHandler from './handler/eventHandler.js'
import commandHandler from './handler/commandHandler.js'
config()

const port = process.env.PORT || process.env.SERVER_PORT || 3000
const token = process.env.TOKEN

let client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
  presence: {
    status: "online",
    activities: [{
      type: ActivityType.Playing,
      name: "/skin | /help for guide"
    }]
  }
})

client.config = fig
client.app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
client.app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/main.html`);
  res.status(200)
});
client.app.listen(port, () => {
  console.log('Bot is ready to online!');
});
client.rest.on("rateLimited", () => {
  console.log("helo u got ratelimit haha")
})

const filter = file => file.endsWith(".js");

client.slash = new Collection();
client.slashArray = [];

client.slashDev = new Collection();
client.slashDevArray = [];

client.names = [];

(async () => {
  const command = readdirSync("./slashes/").filter(filter);
  const event = readdirSync('./events/').filter(filter);
  await commandHandler(command, client)
  await eventHandler(event, client)
})() 

client.login(token)