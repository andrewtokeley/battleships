import { onSnapshot, doc, addDoc, query, collection, where, deleteDoc, writeBatch, getDocs } from 'firebase/firestore'
import { MessageDataConverter } from '../dataEntities/messageData'
// import { useUserStore } from '../../store/userStore'
import { db } from './firebase'

const COLLECTION_ID = 'messages'

/**
 * Send a message
 *
 * @param {Object} messageData MessageData instance
 * @param {Object} options Options include
 *  - deleteOnReceived (Bool)
 * @returns Promise resolving with the id of the message
 */
export const send = async function (messageData, options) {
  // augment the messageData with whether to delete the message once processsed
  messageData.deleteOnReceive = options ? (options.deleteOnReceive ?? true) : true

  const docRef = await addDoc(collection(db, COLLECTION_ID).withConverter(MessageDataConverter), messageData)
  return docRef.id
}

/**
 * Listen for any messages sent to the authenticated user, calling the handler with each received messages
 * @param {*} gameId
 * @param {*} messageType
 * @param {*} hanler
 * @returns An unsubscribe function that can be called to cancel the snapshot listener.
 */
export const attachMessageListener = function (userId, gameId, messageType, handler) {
  if (!userId) {
    throw new Error('Must be authenticated to receive messages.')
  }

  const q = query(collection(db, COLLECTION_ID).withConverter(MessageDataConverter),
    where('gameId', '==', gameId),
    where('messageType', '==', messageType),
    where('forUserId', '==', userId)
  )
  return onSnapshot(q, (snapshot) => {
    // Call the handler for each newly added message
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const message = change.doc.data()
        handler(message)

        if (message.deleteOnReceive) {
          deleteMessage(message.id)
        }
      }
    })
  })
}

/**
 * Delete message
 *
 * @param {*} messageId document id of the message
 */
export const deleteMessage = async function (messageId) {
  const ref = doc(db, COLLECTION_ID, messageId)
  await deleteDoc(ref)
}

/**
 * Deletes all message for a game
 * @param {*} gameId
 */
export const deleteMessages = function (gameId) {
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
