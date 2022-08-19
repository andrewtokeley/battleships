import { onSnapshot, getDocs, writeBatch, setDoc, doc, query, collection, where, orderBy, limit, updateDoc, deleteDoc, addDoc } from 'firebase/firestore'
import { ScoreData, ScoreDataConverter } from '../dataEntities/scoreData'
import { db } from './firebase'

const COLLECTION_ID = 'scores'

/**
 * Returns the score history for the two players in the format
 * {
 *  numberOfGamesPlayed: 0,
 *  player1Won: 0,
 *  player2Won: 0
 * }
 *
 * @param {*} player1
 * @param {*} player2
 */
export const getScoreHistory = async function (player1, player2) {
  const result = {
    numberOfGamesPlayed: 0,
    player1Won: 0,
    player2Won: 0
  }
  const ref = collection(db, COLLECTION_ID)
  const player1WonQuery = getDocs(query(ref, where('winner', '==', player1), where('loser', '==', player2)).withConverter(ScoreDataConverter))
  const player2WonQuery = getDocs(query(ref, where('winner', '==', player2), where('loser', '==', player1)).withConverter(ScoreDataConverter))
  const [snapshot1, snapshot2] = await Promise.all([player1WonQuery, player2WonQuery])

  const player1WonDocs = snapshot1.docs.map(s => s.data())
  const player2WonDocs = snapshot2.docs.map(s => s.data())

  result.numberOfGamesPlayed = player1WonDocs.length + player2WonDocs.length
  result.player1Won = player1WonDocs.length
  result.player2Won = player1WonDocs.length

  return result
}

/**
 *
 * @param {*} winnerUserId
 * @param {*} againstUserId
 */
export const addScore = async function (winnerUserId, againstUserId) {
  const ref = doc(collection(db, COLLECTION_ID).withConverter(ScoreDataConverter))
  await setDoc(ref, new ScoreData({ winner: winnerUserId, loser: againstUserId }), { merge: true })
}
