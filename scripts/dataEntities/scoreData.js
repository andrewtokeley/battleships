import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'

/**
 * config
 * - id: auto id
 * - winner: the userid of the winner
 * - loser: the userid of the loser
 * - datePlayed: date the game was played
 */
export class ScoreData {
  constructor (config) {
    this.id = config.id
    this.winner = config.winner
    this.loser = config.loser
    this.datePlayed = config.datePlayed ?? DateTime.local()
  }
}

export const ScoreDataConverter = {
  toFirestore (data) {
    const result = {}
    if (data.winner) { result.winner = data.winner }
    if (data.loser) { result.loser = data.loser }
    if (data.datePlayed) { result.datePlayed = Timestamp.fromDate(data.datePlayed.toJSDate()) }
    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      winner: data.winner,
      loser: data.loser,
      datePlayed: data.datePlayed ? DateTime.fromJSDate(data.datePlayed.toDate()) : DateTime.local()
    }
    return new ScoreData(config)
  }
}
