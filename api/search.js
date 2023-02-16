const axios = require("axios")
const noblox = require("noblox.js")
async function search(username) {
  let array = []
  if(!username) return [];
  const api = await axios.get(`https://users.roblox.com/v1/users/search?keyword=${encodeURI(username)}&limit=25`).catch(err =>{})
  if(api && api.status == 200 && api.data){
   array = api.data.data.filter((e) => e.name.toLowerCase().startsWith(username.toLowerCase())) 
  }
  if(!isNaN(username) && parseInt(username) > 0){
    let name = parseInt(username)
    const usern = await noblox.getUsernameFromId(name).catch((e) =>{}) 
    if(!usern) return;
    array.pop()
    array.unshift({ name: usern })
  }
  return array.map(e => ({
    name: e.name,
    value: e.name
  }))
}
module.exports = search