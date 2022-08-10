export class ErrorType {
  static all = function () {
    return [ErrorType.GameFull, ErrorType.GameDoesNotExist]
  }

  static GameFull = new ErrorType(1001, 'GameFull', 'Sorry, you can not join this game.')
  static GameDoesNotExist = new ErrorType(1002, 'GameDoesNotExist', 'The game does not exist.')
  static UnknownError = new ErrorType(0, 'UnknownError', 'Unknown error man.')

  constructor (code, name, description) {
    this.code = code
    this.name = name
    this.description = description
  }

  static fromCode (code) {
    const codeValue = Number(code)
    const error = ErrorType.all().find(e => e.code === codeValue)
    if (error) {
      return error
    } else {
      return ErrorType.UnknownError
    }
  }
}

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

export class BattleshipType {
  static Carrier = new BattleshipType('Carrier')
  static Battleship = new BattleshipType('Battleship')
  static Cruiser = new BattleshipType('Cruiser')
  static Submarine = new BattleshipType('Submarine')
  static Destroyer = new BattleshipType('Destroyer')
  static all = [this.Carrier, this.Battleship, this.Cruiser, this.Submarine, this.Destroyer]

  constructor (name) {
    this.name = name
  }

  get colour () {
    switch (this.name) {
      case BattleshipType.Destroyer.name:
        return '#ea9999ff'
      case BattleshipType.Submarine.name:
        return '#6aa84fff'
      case BattleshipType.Cruiser.name:
        return '#6aa84fff'
      case BattleshipType.Battleship.name:
        return '#b7b7b7ff'
      case BattleshipType.Carrier.name:
        return '#f1c232ff'
      default:
        console.log(this)
        return 'red'
    }
  }
}

/**
 * State of the game
 */
export class GameState {
  // Pending - the owner created the game, but hasn't invited, or is waiting, for an opponent
  static Pending = new GameState('pending')
  // PrepareBattleships - get your ships ready for battle
  static PrepareBattleships = new GameState('prepareBattleships')
  // Waiting - you have prepared ships and are waiting
  static Waiting = new GameState('waiting')
  // WaitingForYou - your opponent is waiting for you to prepare for battle
  static WaitingForYou = new GameState('waitingForYou')
  // Ready - both players have saved their battleship postions and are ready to play
  static Ready = new GameState('ready')
  // YourMove - allows a play to make a move
  static YourMove = new GameState('yourMove')
  // TheirMove - tells the player to wait for the opponent to  move
  static TheirMove = new GameState('theirMove')
  // Finished - the game is over
  static Finished = new GameState('finished')

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
