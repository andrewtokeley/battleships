import { BattlefieldLayout } from './battlefieldLayout'

/**
 * Represents a board
 */
export class Board {
  /**
   * Create a new battleship instance
   *
   * @param {*} config contains;
   *  - size
   *  - battleships
   *  - shots
   *
   */
  constructor (config) {
    this.size = config.size
    this.layout = new BattlefieldLayout(1000, config.size, 2)
    this.battleships = config.battleships
    this.shots = config.shots
  }

  /**
   * Returns the battleship at the given position, or null if no battleship exists
   *
   * @param {*} gridRef
   */
  battleshipAt (gridRef) {
    const battleship = this.battleships.find(b => b.intersectsWith(gridRef))
    return battleship
  }

  /**
   * Returns whether the battleships are in valid positions and not overlapping eachother
   */
  get isValid () {
    for (let i = 0; i < this.battleships.length; i++) {
      for (let j = 0; j < this.battleships.length; j++) {
        if (i !== j) {
          if (this.battleships[i].intersectsWithBattleship(this.battleships[j])) {
            return false
          }
        }
      }
    }
    return true
  }
}
