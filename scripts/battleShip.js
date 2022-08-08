import { BattleshipData } from './dataEntities/battleshipData'
import { BattleshipType } from './Types'

/**
 * Represents a battleship
 */
class Battleship {
  /**
   * Create a new battleship instance
   *
   * @param {*} config - object with properties;
   * - id
   * - name
   * - location {row, column}
   * - length
   * - vertical
   */
  constructor (config) {
    this.id = config.id
    this.type = config.type
    this.location = config.location
    this.name = config.name
    this.length = config.length
    this.vertical = config.vertical
    this.selected = false
  }

  static fromBattleshipData (data) {
    return new Battleship({
      id: data.id,
      type: new BattleshipType(data.name),
      name: data.name,
      location: data.location,
      length: data.length,
      vertical: data.vertical
    })
  }

  toBattleshipData (gameId, playerId) {
    return new BattleshipData({
      id: this.id,
      name: this.name,
      length: this.length,
      location: this.location,
      vertical: this.vertical,
      gameId,
      playerId
    })
  }

  /**
   * Returms an array of locations the battleship occupies
   */
  get cells () {
    if (!this.location) { return null }

    const cells = []
    for (let i = 0; i < this.length; i++) {
      if (this.vertical) {
        cells.push({ row: this.location.row + i, column: this.location.column })
      } else {
        cells.push({ row: this.location.row, column: this.location.column + i })
      }
    }
    return cells
  }

  /**
   * Returns whether the location intersects with the battleship
   * @param {*} location
   * @returns
   */
  intersectsWith (location) {
    if (!this.location) { return false }
    if (this.vertical) {
      return location.column === this.location.column && location.row >= this.location.row && location.row < this.location.row + this.length
    } else {
      return location.row === this.location.row && location.column >= this.location.column && location.column < this.location.column + this.length
    }
  }

  /**
   * Returns whether the battleship overlaps with another
   * @param {*} battleship
   * @returns
   */
  intersectsWithBattleship (battleship) {
    if (!this.location) { return false }
    const cells = battleship.cells
    for (let i = 0; i < cells.length; i++) {
      if (this.intersectsWith(cells[i])) {
        return true
      }
    }
    return false
  }

  /**
   * Toggles the rotation of the battleship
   */
  rotate (gridSize) {
    let canRotate = false
    console.log('stop')
    if (this.vertical) {
      // will rotating move outside the grid
      canRotate = this.location.column + this.length - 1 <= gridSize
    } else {
      canRotate = this.location.row + this.length - 1 <= gridSize
    }
    if (canRotate) {
      this.vertical = !this.vertical
    }
  }

  /**
   * Move the battleship by the row/column deltas
   * @param {*} delta
   * @param {*} gridSize
   */
  moveBy (delta, gridSize) {
    if (!this.location) { return }
    this.move({ row: this.location.row + delta.row, column: this.location.column + delta.column }, gridSize)
  }

  /**
   * Move the battleship to a new location
   *
   * @param {*} to
   * @param {*} gridSize
   */
  move (to, gridSize) {
    if (!this.location) { return }
    let canMoveRow = false
    let canMoveColumn = false
    if (this.vertical) {
      canMoveRow = (to.row + this.length - 1 <= gridSize && to.row >= 1)
      canMoveColumn = (to.column <= gridSize && to.column >= 1)
    } else {
      canMoveRow = (to.row <= gridSize && to.row >= 1)
      canMoveColumn = (to.column + this.length - 1 <= gridSize && to.column >= 1)
    }
    if (canMoveRow) { this.location.row = to.row }
    if (canMoveColumn) { this.location.column = to.column }
  }

  /**
   * The cell where the rotate action is located
   */
  get cellForRotate () {
    if (!this.location) { return }
    return { row: this.location.row, column: this.location.column }
  }

  /**
   * The colour of the battleship based on it's length
   */
  // get colour () {

  // }
}

export { Battleship }
