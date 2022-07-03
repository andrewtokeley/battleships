export class Board {
  static Opponent = new Board('opponent')
  static Own = new Board('own')

  constructor (name) {
    this.name = name
  }
}

export class MoveDirection {
  static Left = new MoveDirection('left')
  static Right = new MoveDirection('right')
  static Up = new MoveDirection('up')
  static Down = new MoveDirection('down')

  constructor (name) {
    this.name = name
  }
}

/**
 * Actions that can be performed on a battleship during set up
 */
// export class EditAction {
//   static move = new EditAction('move')
//   static rotate = new EditAction('rotate')
//   static none = new EditAction('none')
//   constructor (name) {
//     this.name = name
//   }
// }
