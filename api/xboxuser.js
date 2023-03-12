import axios from "axios"
export default async (username) => {
  const config = {
    "headers": {
      "x-authorization": process.env.XBOX_TOKEN
    }
  }
  const api = await axios.get(`https://xbl.io/api/v2/search/${username}`, config).catch(err => {})
  if(!api || api.status !== 200) return undefined;
  if(!api.data) return undefined;
  if(!api.data.people.length) return undefined;
  const data = api.data.people[0]
  const json = {
    name: data.gamertag, 
    xuid: data.xuid,
    avatarURL: data.displayPicRaw,
    gamerscore: data.gamerScore, 
    followerCount: data.detail.followerCount,
    followingCount: data.detail.followingCount, 
    realname: data.realName, 
    color: data.preferredColor.primaryColor
  }
  return json
}