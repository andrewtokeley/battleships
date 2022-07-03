
/**
 * Used to represent the battleships within games
 */
class BattleshipData {
  /**
   * Construct a new game data instance.
   *
   * @param {*} config - initial data for instance
   *  - id (don't set, will be set by retrieve service methods)
   *  - gameId - the id (i.e. game code) of the game
   *  - playerId = user id the battleship belongs to
   *  - length = length of the battleship
   *  - vertical - boolean indicating whether vertical or horizontal
   */
  constructor (config) {
    this.id = config.id
    this.gameId = config.gameId
    this.playerId = config.playerId
    this.location = config.location
    this.length = config.length
    this.vertical = config.vertical
  }
}

//
/**
 * FirestoreDataConverter implementation for GameData instances
 */
const BattleshipDataConverter = {
  toFirestore (battleship) {
    const result = {}
    if (battleship.gameId) { result.gameId = battleship.gameId }
    if (battleship.playerId) { result.playerId = battleship.playerId }
    if (battleship.location) { result.location = battleship.location }
    if (battleship.length) { result.length = battleship.length }
    if (battleship.vertical != null) { result.vertical = battleship.vertical }

    return result
  },

  fromFirestore (snapshot, options) {
    const data = snapshot.data(options)
    const config = {
      id: snapshot.id,
      gameId: data.gameId,
      playerId: data.playerId,
      location: data.location,
      length: data.length,
      vertical: data.vertical
    }

    return new BattleshipData(config)
  }
}

export { BattleshipData, BattleshipDataConverter }
