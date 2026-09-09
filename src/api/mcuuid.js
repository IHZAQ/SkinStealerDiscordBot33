import axios from "axios"
export const java = async (username) => {
  const api = await axios.get(`https://api.mojang.com/users/profiles/minecraft/${username}`).catch((err) => { })
  if (!api || api.status === 204 || !api.data) return undefined;
  if (api.status === 200) return api.data;
  return null;
}

export const bedrock = async (username) => {
  const xuid = await axios.get(`https://api.geysermc.org/v2/xbox/xuid/${username}`).catch((err) => { })
  if (!xuid || xuid.status === 204 || !xuid.data) return undefined;
  const textureId = await axios.get(`https://api.geysermc.org/v2/skin/${xuid.data.xuid}`).catch((err) => { })
  if (!textureId || textureId.status === 204 || !textureId.data) return undefined;
  if (textureId.status === 200) return { name: username, id: textureId.data.texture_id, xuid: xuid.data.xuid };
  return null;
}