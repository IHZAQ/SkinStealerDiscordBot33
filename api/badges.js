const axios = require("axios")
const emoji = require("./../data/bedji")
module.exports = async (ids) => {
  const { data } = await axios.get(`https://accountinformation.roblox.com/v1/users/${ids}/roblox-badges`)
  let id = data.sort((a, b) => a.id - b.id).map((e) => emoji.get(e.id)).join(" ")
  return id
}