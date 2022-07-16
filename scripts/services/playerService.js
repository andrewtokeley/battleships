import { getDoc, onSnapshot, setDoc, doc } from 'firebase/firestore'
import { PlayerDataConverter } from '../dataEntities/playerData'
import { db } from './firebase'

const COLLECTION_ID = 'players'

/**
 * Listen for any shot taken at your board by opponent
 * @param {*} gameId
 * @param {*} userId userId you want to know about changes to
 * @param {*} handler called when opponent's name changes
 * @returns Promise
 */
export const attachPlayerChangeListener = function (userId, handler) {
  return onSnapshot(
    doc(db, COLLECTION_ID, userId).withConverter(PlayerDataConverter),
    { includeMetadataChanges: false },
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const player = change.doc.data()
        if (change.type === 'modified') {
          handler(player)
        }
      })
    })
}

/**
 * Adds and returns a Player
 *
 * @param {PlayerData} playerData a PlayerData instance
 */
export const addOrUpdatePlayerData = async function (playerData) {
  const docRef = doc(db, COLLECTION_ID, playerData.id).withConverter(PlayerDataConverter)
  await setDoc(docRef, playerData, { merge: true })
}

export const getPlayerData = async function (id) {
  console.log('get plae' + id)
  const ref = doc(db, COLLECTION_ID, id).withConverter(PlayerDataConverter)
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}
