import axios from "axios"
const hiveuser = new Map()
export default async (username, type) => {
  let data = hiveuser.get(username)
  if(!data){
   const api  = await axios.get(`https://api.playhive.com/v0/game/all/all/${username}`).catch(err =>{});
   if(!api) {
     return null;
   }
   data = api.data
   hiveuser.set(username,data)
   setTimeout(() => {
     hiveuser.delete(username)
   }, 1800000)
  }
  let nedre = type ? data[type] : data;
  return nedre
}