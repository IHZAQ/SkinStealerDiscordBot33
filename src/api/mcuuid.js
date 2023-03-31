import axios from "axios"
export default async (username) => {
    const api = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`).catch((err) => {})
    if(!api) return undefined;
    if(api.status == 200 && api.data){
      return api.data
    } else if(api.status === 204 || !api.data){
      return undefined
    } else {
      return null
    }
}