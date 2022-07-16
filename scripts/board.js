import { BattlefieldLayout } from './battlefieldLayout'
import { Battleship } from './battleShip'
import { BattleshipType } from './Types'

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
    this.layout = new BattlefieldLayout(1000, config.size, 5)
    if (config.battleships.length > 0) {
      this.battleships = config.battleships
    } else {
      // we don't know the locations of the opponent, but need the ships to mark damage against
      this.battleships = [
        new Battleship({ type: BattleshipType.Carrier, name: BattleshipType.Carrier.name, length: 5 }),
        new Battleship({ type: BattleshipType.Battleship, name: BattleshipType.Battleship.name, length: 4 }),
        new Battleship({ type: BattleshipType.Cruiser, name: BattleshipType.Cruiser.name, length: 3 }),
        new Battleship({ type: BattleshipType.Submarine, name: BattleshipType.Submarine.name, length: 3 }),
        new Battleship({ type: BattleshipType.Destroyer, name: BattleshipType.Destroyer.name, length: 2 })
      ]
    }
    this.damage = this.battleships.map((b) => { return { type: b.type, name: b.name, length: b.length, hits: 0 } })
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

  /**
   * Records when a battelship has been shot. This method is required because you won't
   * have a record of battleships on your opponents board and we need to be able to do damage
   * reports
   */
  recordDamage (battleshipName) {
    const damage = this.damage.find(d => d.name.toUpperCase() === battleshipName.toUpperCase())
    if (damage) {
      damage.hits += 1
    }
    // Returns true if the ship sinks
    return damage.hits === damage.length
  }
}
