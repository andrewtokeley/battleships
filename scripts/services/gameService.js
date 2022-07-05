
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { GameDataConverter } from '../dataEntities/gameData'
import { db } from './firebase'

const COLLECTION_ID = 'games'

/**
 * Resolves with the GameData associated with the gameId. If no game exists the method will still resolve but with null.
 * @param {*} id
 * @returns
 */
export const getGameData = async function (id) {
  const ref = doc(db, COLLECTION_ID, id).withConverter(GameDataConverter)
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    const game = docSnap.data()
    return game
  } else {
    return null
  }
}

/**
 * Join a game
 * @param {*} gameId id of the game
 * @param {*} userid id of the user joining
 */
export const joinGame = async function (gameId, userId) {
  // make sure the game exists
  const game = await getGameData(gameId)
  if (game && game.id === gameId) {
    // game exists, but are there any player spots free
    const gameData = {}
    if (game.player1 && !game.player2) {
      gameData.player2 = userId
    } else if (game.player2 && !game.player1) {
      gameData.player1 = userId
    } else {
      throw (new Error('No room for more players'))
    }

    await updateGame(gameData)
  } else {
    throw (new Error('Game does not exist'))
  }
}

const updateGame = async function (gameData) {
  await updateDoc(doc(db, COLLECTION_ID, gameData.id).withConverter(GameDataConverter), gameData)
}

/**
 * Adds or updates a game to the data store. If the game record doesn't exist it will be created.
 *
 * @param {GameData} gameData
 * @returns
 */
export const addOrUpdateGameData = async function (gameData) {
  await setDoc(doc(db, COLLECTION_ID, gameData.id).withConverter(GameDataConverter), gameData, { merge: true })
  return gameData
}

export const uniqueGameCode = function () {
  return new Promise(function (resolve, reject) {
    const letters = Array(26).fill().map((element, index) => String.fromCharCode('A'.charCodeAt(0) + index))
    // get random sequence
    let code = ''
    for (let i = 0; i < 5; i++) {
      code += letters[Math.floor(Math.random() * letters.length)]
    }
    resolve(code)
  })
}
