import axios from "axios";
const hiveuser = new Map();
const hiveleaderboard = new Map();
setInterval(() => {
  hiveuser.clear()
  hiveleaderboard.clear()
}, 12 * 60 * 60 * 1000)
export const getHive = async (username, typeGame) => {
  const type = (typeGame !== "main" && typeGame) ? typeGame : null;
  let data = hiveuser.get(username)
  let isAvailable = true
  let isMain = true;
  if (!data) {
    let api = await axios.get(`https://api.playhive.com/v0/game/all/all/${encodeURI(username)}`).catch(err => { });
    if (!api) isAvailable = false;
    else {
      data = api.data
      hiveuser.set(username, data)
    }
  }
  if (!isAvailable || (typeGame && !(typeGame in data))) {
    let api;
    if (!type) api = await axios.get(`https://api.playhive.com/v0/game/all/main/${encodeURI(username)}`).catch(err => { });
    if (!api) isMain = false;
    if (!api && !type) return null;
    if (!api && type) api = await axios.get(`https://api.playhive.com/v0/game/all/${type}/${encodeURI(username)}`).catch(err => { });
    else return null;
    data = ("main" in api) ? api.data : { [type]: api.data };
    if (hiveuser.get(username)) hiveuser.get(username)[type] = data[type];
    else hiveuser.set(username, data)
  }
  if (!data[typeGame || "main"]) return null;
  return { data, isAvailable, isMain }
}
export const getLeaderboard = async (game, type, date) => {
  let data = hiveleaderboard.get(`${game}-${type}${date ? `-${date}` : ""}`)
  if (!data) {
    let url;
    switch (type) {
      case "alltime":
        url = `https://api.playhive.com/v0/game/all/${game}`;
        break;
      case "monthly":
        url = `https://api.playhive.com/v0/game/monthly/${game}/${date}/100/0`;
        break;
      case "season":
        url = `https://api.playhive.com/v0/game/season/${game}/${date}`;
    }
    const api = await axios.get(url).catch(err => { });
    if (!api) return null;
    data = api.data
  }
  return data.map(e => e.username)
}