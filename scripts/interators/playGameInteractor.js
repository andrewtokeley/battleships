// import { addGameData } from '../services/gameService'
import { Board } from '../board'
import { getDefaultBattleshipsForPlayer, getBattleships } from '../services/battleshipService'
import { getGameData, addOrUpdateGameData } from '../services/gameService'
import { Battleship } from '../../scripts/battleShip'

// import { battleshipAt, rotateBattleship, moveBattleship } from '../services/battleshipService'

/**
 * This class is responsible for interacting with the data services to bring data into the play-game component
 */
export class PlayGameInteractor {
  constructor () {
    this.selectedBattleship = null
  }

  /**
   * Returns the GameData instance for the game. If there is no game in the store, returns null.
   *
   * @param {*} gameId
   * @returns
   */
  async getGame (gameId) {
    const gameData = await getGameData(gameId)
    return gameData
  }

  /**
   * Adds the user to the game and resolves with the updated GameData.
   *
   * If the game doesn't exist, or the game is full, the method will reject with error.
   * @param {*} gameId
   * @param {*} playerId
   * @returns
   */
  addPlayerToGame (gameId, playerId) {
    return new Promise(function (resolve, reject) {
      getGameData(gameId).then((gameData) => {
        if (!gameData) {
          // Game doesn't exist
          reject(Error('Game does not exist'))
        } else if (gameData.playerExists(playerId)) {
          // Player already added to game, all good
          resolve(gameData)
        } else {
          // Add the player to the game and return updated GameData
          const playerAdded = gameData.addPlayer(playerId)
          if (playerAdded) {
            addOrUpdateGameData(gameData).then((result) => {
              resolve(result)
            })
          } else {
            // Game is full
            reject(Error('Game already has two players'))
          }
        }
      })
    })
  }

  /**
  * Resolves with a fully populated GameViewMode, that includes the current user's default start battleships.
  */
  async getGameViewModel (id, userId) {
    const [gameData, battleshipsData] = await Promise.all([getGameData(id), getBattleships(id, userId)])

    if (!gameData) {
      return null
    }

    let battleships = []
    if (battleshipsData.length === 0) {
      battleships = getDefaultBattleshipsForPlayer(gameData, userId)
      battleships = battleships.map(b => Battleship.fromBattleshipData(b))
    } else {
      battleships = battleshipsData.map(b => Battleship.fromBattleshipData(b))
    }
    return {
      gameCode: gameData.id,
      board: new Board({
        size: gameData.boardSize,
        battleships,
        shots: []
      })
    }
  }
}
