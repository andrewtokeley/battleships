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
   *  - dateCreated (optional, should be a luxon DateTime)
   *  - boardSize
   *  - ownerId - the id of the user who created the game
   *  - opponent - the id of the opponent
   *  - state - serialised Game state
   */
  constructor (config) {
    this.id = config.id
    this.boardSize = config.boardSize ?? 10
    this.dateCreated = config.dateCreated ?? DateTime.local()
    this.ownerId = config.ownerId
    this.ownerReady = config.ownerReady
    this.opponentId = config.opponentId
    this.opponentReady = config.opponentReady
    this.state = config.state
  }

  /**
   * Returns whether one of the two players is the same as the player supplied.
   *
   * @param {*} playerId
   * @returns
   */
  playerExists (playerId) {
    return this.ownerId === playerId || this.opponentId === playerId
  }

  // canJoin (playerId) {
  //   return this.playerExists(playerId) || this.opponentId === null
  // }

  // canPlay () {
  //   return this.ownerReady && this.ownerReady
  // }

  canJoin (userId) {
    console.log('canJoin')
    return (this.playerExists(userId) || !this.opponentId)
  }
  // /**
  //  * Adds a new player to the game, if possible. If there are already 2 players in the game the function returns false, otherwise true
  //  * @param {*} playerId
  //  */
  // addPlayer (playerId) {
  //   // can't add someone twice
  //   if ([this.player1, this.player2].includes(playerId)) {
  //     return false
  //   }

  //   if (this.player1 == null) {
  //     this.player1 = playerId
  //     return true
  //   } else if (this.player2 == null) {
  //     this.player2 = playerId
  //     return true
  //   } else {
  //     // No room for another player
  //     return false
  //   }
  // }
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
    if (game.ownerId) { result.ownerId = game.ownerId }
    if (game.opponentId) { result.opponentId = game.opponentId }
    if (game.state) { result.state = game.state }
    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      boardSize: data.boardSize,
      dateCreated: data.date ? DateTime.fromJSDate(data.date.toDate()) : DateTime.local(),
      ownerId: data.ownerId,
      opponentId: data.opponentId,
      state: data.state
    }

    return new GameData(config)
  }
}

export { GameData, GameDataConverter }
