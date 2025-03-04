import axios from "axios";
export default async (username) => {
    const api = await axios.get(`https://tlauncher.org/catalog/nickname/tlauncher_${encodeURI(username)}/img/0/`, { responseType: "arraybuffer" }).catch(err => { });
    if (!api || !api.data) return undefined;
    const data = Buffer.from(api.data)
    return data
}