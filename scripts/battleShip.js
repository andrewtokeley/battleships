
/**
 * Represents a battleship
 */
class Battleship {
  /**
   * Create a new battleship instance
   *
   * @param {*} location
   * @param {*} length
   * @param {*} vertical
   */
  constructor (id, location, length, vertical) {
    this.id = id
    this.location = location
    this.length = length
    this.vertical = vertical
    this.selected = false
  }

  static fromBattleshipData (data) {
    return new Battleship(data.id, data.location, data.length, data.vertical)
  }

  /**
   * Returms an array of locations the battleship occupies
   */
  get cells () {
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
  rotate () {
    this.vertical = !this.vertical
  }

  /**
   * Move the battleship by the row/column deltas
   * @param {*} delta
   * @param {*} gridSize
   */
  moveBy (delta, gridSize) {
    this.move({ row: this.location.row + delta.row, column: this.location.column + delta.column }, gridSize)
  }

  /**
   * Move the battleship to a new location
   *
   * @param {*} to
   * @param {*} gridSize
   */
  move (to, gridSize) {
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
    return { row: this.location.row, column: this.location.column }
  }

  /**
   * The colour of the battleship based on it's length
   */
  get colour () {
    switch (this.length) {
      case 2:
        return '#ea9999ff'
      case 3:
        return '#6aa84fff'
      case 4:
        return '#b7b7b7ff'
      case 5:
        return '#f1c232ff'
      default:
        return 'clear'
    }
  }
}

export { Battleship }
