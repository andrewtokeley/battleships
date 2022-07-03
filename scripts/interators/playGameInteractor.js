// import { addGameData } from '../services/gameService'
import { Board } from '../board'
import { addDefaultBattleships, getBattleships } from '../services/battleshipService'
import { getGameData } from '../services/gameService'
import { Battleship } from '../battleShip'

// import { battleshipAt, rotateBattleship, moveBattleship } from '../services/battleshipService'

/**
 * This class is responsible for interacting with the data services to bring data into the play-game component
 */
export class PlayGameInteractor {
  constructor () {
    this.vm = null
    this.selectedBattleship = null
  }

  /**
 * Creates a new game and returns a promise containing a GameViewModel instance
 */
  async getGame (id, userId) {
    console.log('userid ' + userId)
    const [addedBattleships, gameData, battleships] = await Promise.all([addDefaultBattleships(id, userId), getGameData(id), getBattleships(id, userId)])
    if (addedBattleships) {
      return {
        gameCode: id,
        board: new Board({
          size: gameData.boardSize,
          battleships: battleships.map(b => Battleship.fromBattleshipData(b)),
          shots: []
        })
      }
    }
  }
}
