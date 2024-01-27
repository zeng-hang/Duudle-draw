import { JSONFilePreset } from 'lowdb/node'

const defaultData = {
  users: {}
}
const db = await JSONFilePreset('db.json', defaultData)

export default db
