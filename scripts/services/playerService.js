import { getDoc, setDoc, doc } from 'firebase/firestore'
import { PlayerDataConverter } from '../dataEntities/playerData'
import { db } from './firebase'

const COLLECTION_ID = 'players'

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
  const docSnap = await getDoc(doc(db, COLLECTION_ID, id).withConverter(PlayerDataConverter))
  if (docSnap.exists) {
    return docSnap.data()
  }
  return null
}
