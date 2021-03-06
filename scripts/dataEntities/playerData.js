export class PlayerData {
  constructor (config) {
    this.id = config.id
    this.name = config.name
  }
}

export const PlayerDataConverter = {
  toFirestore (data) {
    const result = {}
    if (data.name) { result.name = data.name }
    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      name: data.name
    }

    return new PlayerData(config)
  }
}
