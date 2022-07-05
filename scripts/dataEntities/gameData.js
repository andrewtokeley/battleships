import { DateTime } from 'luxon'
import { Timestamp } from 'firebase/firestore'
/**
 * Used to send and recieve data from data store
 */
class GameData {
  /**
   * Construct a new game data instance.
   *
   * @param {*} config data to construct the instance with;
   *  - id (this is the gameCode and unique firestore document id)
   *  - boardSize
   *  - player1
   *  - player2 (optional)
   *  - id (don't set, this is readonly and set by service methods only)
   *  - dateCreated (optional, should be a luxon DateTime)
   */
  constructor (config) {
    this.id = config.id
    this.boardSize = config.boardSize ?? 10
    this.dateCreated = config.dateCreated ?? DateTime.local()
    this.player1 = config.player1
    this.player2 = config.player2
  }

  /**
   * Returns whether one of the two players is the same as the player supplied.
   *
   * @param {*} playerId
   * @returns
   */
  playerExists (playerId) {
    return this.player1 === playerId || this.player2 === playerId
  }

  /**
   * Adds a new player to the game, if possible. If there are already 2 players in the game the function returns false, otherwise true
   * @param {*} playerId
   */
  addPlayer (playerId) {
    // can't add someone twice
    if ([this.player1, this.player2].includes(playerId)) {
      return false
    }

    if (this.player1 == null) {
      this.player1 = playerId
      return true
    } else if (this.player2 == null) {
      this.player2 = playerId
      return true
    } else {
      // No room for another player
      return false
    }
  }
}

//
/**
 * FirestoreDataConverter implementation for GameData instances
 */
const GameDataConverter = {
  toFirestore (game) {
    const result = {}
    if (game.boardSize) { result.boardSize = game.boardSize }
    if (game.dateCreated) { result.dateCreated = Timestamp.fromDate(game.dateCreated.toJSDate()) }
    if (game.player1) { result.player1 = game.player1 }
    if (game.player2) { result.player2 = game.player2 }
    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      boardSize: data.boardSize,
      dateCreated: data.date ? DateTime.fromJSDate(data.date.toDate()) : DateTime.local(),
      player1: data.player1,
      player2: data.player2
    }

    return new GameData(config)
  }
}

export { GameData, GameDataConverter }
