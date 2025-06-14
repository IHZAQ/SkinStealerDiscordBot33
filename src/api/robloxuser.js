import axios from "axios";
import emojiData from "../data/bedji.js"
const config = {
    "headers": {
        "x-api-key": process.env.ROBLOX_API_KEY
    }
}
export const checkPremium = async (ids) => {
    const api = await axios.get(`https://apis.roblox.com/cloud/v2/users/${ids}`, config).catch(err => { })
    if (!api || !api.data.premium) return false;
    return api.data.premium;
}
export const getThumbnail = async (id) => {
    const api = await axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=420x420&format=Png&isCircular=false`).catch(err => { });
    const data = api.data.data[0].imageUrl;
    return data;
}
export const emoji = async (ids) => {
    const { data } = await axios.get(`https://accountinformation.roblox.com/v1/users/${ids}/roblox-badges`)
    let id = data.sort((a, b) => a.id - b.id).map((e) => emojiData.get(e.id)).join(" ")
    return id
}
export const getIdFromUsername = async (username) => {
    const api = await axios.post(`https://users.roblox.com/v1/usernames/users`, {
        usernames: [username]
    }).catch(err => { })
    if (!api || !api.data.data.length) return undefined;
    return api.data.data[0].id.toString()
}
export const search = async (id) => {
    if (isNaN(id)) return [];
    const api = await axios.get(`https://users.roblox.com/v1/users/${id}`).catch(err => { });
    if (!api) return [];
    let username = api.data.name;
    if (!username) return [];
    return [{
        name: `${username} (${id})`,
        value: username
    }]
}
export const favgame = async (id) => {
    const api = await axios.get(`https://games.roblox.com/v2/users/${id}/favorite/games?accessFilter=2&limit=100&sortOrder=Desc`).catch(err => { });
    if (!api || !api.data || !api.data.data || !api.data.data.length) return undefined;
    const games = api.data.data.map((e) => `[${e.name}](https://www.roblox.com/games/${e.rootPlace.id})`);
    while (games.join(`\n`).length > 4096) games.pop();
    let string = games.join(`\n`)
    return string
}
export const oldNames = async (ids) => {
    const api = await axios.get(`https://users.roblox.com/v1/users/${ids}/username-history?limit=100&sortOrder=Asc`).catch(err => { })
    if (!api) return undefined;
    const dat = api.data
    if (!dat.data.length) return undefined;
    let arr = dat.data.map(e => e.name);
    return [...new Set(arr)];
}
export const getInfo = async (ids) => {
    const api = await axios.get(`https://users.roblox.com/v1/users/${ids}`).catch(err => { });
    if (!api) return undefined;
    let friends = await axios.get(`https://friends.roblox.com/v1/users/${ids}/friends/count`).catch(err => { });
    friends = (!friends || !friends.data || friends.data.count == 0) ? 0 : friends.data.count;
    let followers = await axios.get(`https://friends.roblox.com/v1/users/${ids}/followers/count`).catch(err => { });
    followers = (!followers || !followers.data || followers.data.count == 0) ? 0 : followers.data.count;
    let followings = await axios.get(`https://friends.roblox.com/v1/users/${ids}/followings/count`).catch(err => { });
    followings = (!followings || !followings.data || followings.data.count == 0) ? 0 : followings.data.count;
    const { name, displayName, description, isBanned, id, created } = api.data
    const username = name
    const blurb = description
    const joinDate = created
    const isPremium = await checkPremium(ids)
    return { username, displayName, id, blurb, joinDate, isBanned, friends, followers, followings, isPremium }
}