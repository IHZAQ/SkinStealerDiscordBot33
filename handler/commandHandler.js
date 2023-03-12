export default async (files, client) => {
  for (const file of files) {
   const slash = (await import(`../slashes/${file}`)).default
   if(!slash.dev){
      client.slashArray.push(slash.data.toJSON())
      client.slash.set(slash.data.name, slash)
    } else {
      client.slashDevArray.push(slash.data.toJSON())
      client.slashDev.set(slash.data.name, slash)
    }
  }
}