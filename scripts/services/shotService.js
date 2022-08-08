
import { onSnapshot, getDocs, writeBatch, setDoc, doc, query, collection, where, orderBy, limit, updateDoc, deleteDoc } from 'firebase/firestore'
import { ShotDataConverter } from '../dataEntities/shotData'
// import { useUserStore } from '../../store/userStore'
import { db } from './firebase'

const COLLECTION_ID = 'shots'

/**
 * Gets the shots fired in the game by the given user
 * @param {*} gameId
 * @param {*} userId
 */
export const getShots = async function (gameId, userId) {
  const result = []
  const q = query(
    collection(db, COLLECTION_ID),
    where('gameId', '==', gameId),
    where('playerId', '==', userId)).withConverter(ShotDataConverter)
  try {
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      result.push(doc.data())
    })
    return result
  } catch (e) {
    console.error(e)
    return []
  }
}

/**
 * Fires a shot at the enemies board
 *
 * @param {*} shotData = the game you're shooting in
 * @returns promise resolving with the id of the created shot
 */
export const addOrUpdateShot = async function (shotData) {
  let docRef = null
  if (shotData.id) {
    docRef = doc(db, COLLECTION_ID, shotData.id).withConverter(ShotDataConverter)
  } else {
    docRef = doc(collection(db, COLLECTION_ID).withConverter(ShotDataConverter))
  }
  await setDoc(docRef, shotData, { merge: true })
  return shotData
}

/**
 * Listen for any shot taken at your board by opponent
 * @param {*} gameId
 * @param {*} userId userId of the player shooting
 * @returns Promise
 */
export const attachShotsReceivedListener = function (gameId, userId, handler) {
  const q = query(collection(db, COLLECTION_ID).withConverter(ShotDataConverter),
    where('gameId', '==', gameId),
    where('playerId', '!=', userId),
    orderBy('playerId', 'desc'),
    orderBy('dateCreated', 'desc'),
    limit(1)
  )

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const shot = change.doc.data()
      if (change.type === 'added') {
        handler(shot)
      }
    })
  })
}

/**
 * Will call the handler whenever a shot is marked as a 'hit'
 *
 * @param {*} gameId
 * @param {*} userId userId of the player who made the shot
 * @param {*} handler callback that will be called if a hit is recorded, will have an argument for the shot
 * @returns Promise
 */
export const attachHitListener = function (gameId, userId, handler) {
  const q = query(collection(db, COLLECTION_ID).withConverter(ShotDataConverter),
    where('gameId', '==', gameId),
    where('playerId', '==', userId),
    where('hit', '==', true),
    orderBy('dateCreated', 'desc'),
    limit(1)
  )

  return onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const shot = change.doc.data()
      if (change.type === 'added') {
        handler(shot)
      }
    })
  })
}

/**
 * Marks a shot as being a hit
 * @param {*} shotId
 */
export const markAsHit = async function (shotId, battleshipName) {
  const ref = doc(db, COLLECTION_ID, shotId)
  await updateDoc(ref, { hit: true, battleshipName })
}

/**
 * Delete shot from store
 *
 * @param {*} shotId
 */
export const deleteShot = async function (shotId) {
  const ref = doc(db, COLLECTION_ID, shotId)
  await deleteDoc(ref)
}

/**
 * Delete all shots for a game
 * @param {*} gameId
 * @returns
 */
export const deleteShots = function (gameId) {
  console.log('shot ' + gameId)
  const batch = writeBatch(db)
  // delete from game collection
  const q = query(
    collection(db, COLLECTION_ID),
    where('gameId', '==', gameId))

  return getDocs(q).then(async (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
  })
}
