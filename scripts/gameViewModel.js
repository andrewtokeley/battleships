/**
 * Represents the VM for working with a game (used by play-game Component)
 */
export class GameViewModel {
  /**
   * Construct a new game instance.
   *
   * @param {*} config - contains the following object properties
   * - boardSize
   * - gameCode
   * - battleships
   * - shotsFired
   * - shotsTaken
   * - opponentName
   */
  constructor (config) {
    this.boardSize = config.boardSize
    this.gameCode = config.gameCode
    this.battleships = config.battleships
    this.shotsFired = config.shotsFired
    this.shotsTaken = config.shotsTaken
  }
}
