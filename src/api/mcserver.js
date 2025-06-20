import axios from "axios";
export const java = async (ip, por) => {
    const api = await axios.get(`https://api.mcstatus.io/v2/status/java/${ip}:${por}`).catch(err => { });
    const data = api?.data;
    if (!data) return undefined;
    return {
        online: data.online,
        motd: data?.motd?.clean || `${ip}:${por}`,
        version: data?.version?.name_clean,
        players: data?.players ? `${data.players.online}/${data.players.max}` : undefined,
        favicon: data?.icon,
        list: data?.players?.list || undefined
    }
}
export const bedrock = async (ip, por) => {
    const api = await axios.get(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${por}`).catch(err => { });
    const data = api?.data;
    if (!data) return undefined;
    return {
        online: data.online,
        motd: data?.motd?.clean || `${ip}:${por}`,
        version: data?.version?.name,
        gamemode: data?.gamemode,
        players: `${data?.players?.online}/${data?.players?.max}`
    }
}