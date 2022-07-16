
import { onSnapshot, updateDoc, getDoc, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { GameDataConverter } from '../dataEntities/gameData'
import { db } from './firebase'

const COLLECTION_ID = 'games'

export const attachGameListener = function (id, handler) {
  return onSnapshot(
    doc(db, COLLECTION_ID, id).withConverter(GameDataConverter),
    { includeMetadataChanges: false },
    (doc) => {
      handler(doc)
    })
}

/**
 * Delete the game
 */
export const deleteGame = function (id) {
  // delete from game collection
  const ref = doc(db, COLLECTION_ID, id)
  return deleteDoc(ref)
}

/**
 * Resolves with the GameData associated with the gameId. If no game exists the method will still resolve but with null.
 * @param {*} id
 * @returns
 */
export const getGameData = async function (id) {
  const ref = doc(db, COLLECTION_ID, id).withConverter(GameDataConverter)
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

/**
 * Join the user to a game
 *
 * @param {*} gameId id of the game
 * @param {*} userid id of the user joining
 */
export const joinGame = async function (gameId, userId) {
  // Simply update the opponentId document field
  await updateDoc(doc(db, COLLECTION_ID, gameId).withConverter(GameDataConverter), { opponentId: userId })
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
