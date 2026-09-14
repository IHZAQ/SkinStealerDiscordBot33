import {
  Client,
  ActivityType,
  Collection,
  GatewayIntentBits
} from "discord.js"
import { readdirSync, existsSync } from 'fs'
import { config } from "dotenv"
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import express from "express"
import axios from "axios"
import { rateLimit } from "express-rate-limit"
import fig from "../config.js"
import eventHandler from './handler/eventHandler.js'
import commandHandler from './handler/commandHandler.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const paths = path => resolve(__dirname, path);
const filter = file => file.endsWith(".js");

config({
  path: paths("../.env")
})

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
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  ipv6Subnet: 56
})
client.config = fig
client.app = express()
client.app.set('trust proxy', 1);
client.app.disable('x-powered-by');
client.app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/main.html`);
  res.status(200)
});
if (existsSync(paths("./robots.txt"))) {
  client.app.get('/robots.txt', (req, res) => {
    res.sendFile(`${__dirname}/robots.txt`);
  });
};
if (existsSync(paths("./sitemap.xml"))) {
  client.app.get('/sitemap.xml', (req, res) => {
    res.sendFile(`${__dirname}/sitemap.xml`);
  });
};
client.app.get('/mcs/:name/:ip/:port', (req, res) => {
  const { name, ip, port } = req.params;
  if (!name || !ip || !port) {
    return res.status(400).send('Missing required parameters: name, ip, port');
  }
  res.location(`minecraft://?addExternalServer=${name}|${ip}:${port}`)
  res.status(302).end();
});
client.app.get('/downloadSkin/:identifier/:name', async (req, res) => {
  const { identifier, name } = req.params;
  if (!identifier) return res.status(400).send('Missing required parameter: username or UUID');
  const skinResponse = await axios.get(`https://mc-heads.net/skin/${identifier}.png`, {
    responseType: "stream"
  }).catch(() => { });
  if (!skinResponse || skinResponse.status !== 200) return res.status(404).send('Skin not found');
  res.setHeader('Content-Disposition', `attachment; filename="${name || identifier}.png"`);
  res.setHeader('Content-Type', 'image/png');
  skinResponse.data.pipe(res);
});
client.app.use("/hangman", express.static(paths("./img/hangman")));
client.app.use(limiter)
client.app.listen(port, () => {
  console.log('Bot is ready to online!');
});
client.rest.on("rateLimited", () => {
  console.log("helo u got ratelimit haha")
})
client.checkPerms = (e, i) => (e.channel || !e.inGuild()) ? (i ? true : { flags: 0 }) : (i ? false : { flags: 64 });
client.slash = new Collection();
client.slashArray = [];

client.slashDev = new Collection();
client.slashDevArray = [];

client.names = [];
(async () => {
  const command = readdirSync(paths("./slashes")).filter(filter);
  const event = readdirSync(paths('./events')).filter(filter);
  await commandHandler(command, client)
  await eventHandler(event, client)
})().then(() => {
  client.login(token)
})