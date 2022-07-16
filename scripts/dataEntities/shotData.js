import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'

/**
 * config
 * - id
 * - dateCreated
 * - gameId
 * - playerId (of the player shooting)
 * - location
 */
export class ShotData {
  constructor (config) {
    this.id = config.id
    this.dateCreated = config.dateCreated ?? DateTime.local()
    this.gameId = config.gameId
    this.playerId = config.playerId
    this.location = config.location
    this.hit = config.hit
    this.battleshipName = config.battleshipName
  }
}

export const ShotDataConverter = {
  toFirestore (data) {
    const result = {}
    if (data.dateCreated) { result.dateCreated = Timestamp.fromDate(data.dateCreated.toJSDate()) }
    if (data.gameId) { result.gameId = data.gameId }
    if (data.playerId) { result.playerId = data.playerId }
    if (data.location) { result.location = data.location }
    if (data.hit) { result.hit = data.hit }
    if (data.battleshipName) { result.battleshipName = data.battleshipName }
    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      dateCreated: data.date ? DateTime.fromJSDate(data.date.toDate()) : DateTime.local(),
      gameId: data.gameId,
      playerId: data.playerId,
      location: data.location,
      hit: data.hit,
      battleshipName: data.battleshipName
    }

    return new ShotData(config)
  }
}
