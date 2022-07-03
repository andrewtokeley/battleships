export class BattlefieldLayout {
  /**
   * Constructor
   * @param {*} resolution resolution width of the canvas
   * @param {*} size  number of rows (or columns)
   * @param {*} gridLineWidth the width of the grid line
   */
  constructor (resolution, gridSize, gridLineWidth) {
    this.resolution = resolution
    this.gridSize = gridSize
    this.gridLineWidth = gridLineWidth
  }

  /**
   * The size of an individual cell in the grid
   */
  get cellSize () {
    return (this.resolution - 2 * this.gridLineWidth) / this.gridSize
  }

  /**
   * Returns the canvas coordinates for the given row and column.
   *
   * If centre is true the centre point is returned otherwise the origin (top left)
   * @param {*} location objeect in the form { row, column }
   * @param {*} centre flag to determine whether to return the centre or origin point
   */
  coordinatesAt (location, centre) {
    const x = (this.cellSize * location.column) - (centre ? this.cellSize / 2 : this.cellSize) + this.gridLineWidth
    const y = (this.cellSize * location.row) - (centre ? this.cellSize / 2 : this.cellSize) + this.gridLineWidth
    return { x, y }
  }

  /**
   * Returns the { row, column } reference relative to where the x, y location in the grids's coordinate system
   * @param {*} gridX
   * @param {*} gridY
   */
  gridReferenceAt (gridX, gridY) {
    const row = Math.trunc(gridY / this.cellSize) + 1
    const column = Math.trunc(gridX / this.cellSize) + 1

    return { row, column }
  }

  /**
   * Returns the x, y coordinates in the canvas coordiniate system from screen coordinates
   * @param {*} canvas
   * @param {*} screenX
   * @param {*} screenY
   * @returns
   */
  convertToCanvasCoordinates (canvas, screenX, screenY) {
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (screenX - rect.left) * scaleX
    const y = (screenY - rect.top) * scaleY
    return { x, y }
  }
}
