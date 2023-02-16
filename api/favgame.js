async function get(id) {
    const axios = require("axios");
    const { data } = await axios.get(`https://www.roblox.com/users/favorites/list-json?assetTypeId=9&itemsPerPage=150&pageNumber=1&userId=${id}`).catch(err => {})
    if(!data || !data.IsValid || !data.Data.Items.length) return undefined
    const games = data.Data.Items.map((e) => `[${e.Item.Name}](${e.Item.AbsoluteUrl})`)
    const originlength = games.join(`/n`).length
    while(games.join(`\n`).length > 4096) games.pop();
    let string = games.join(`\n`)
    return {
      string, 
      originlength
    }
}
module.exports = get