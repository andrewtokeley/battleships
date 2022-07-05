import { collection, addDoc, query, getDocs, where } from 'firebase/firestore'
import { BattleshipData, BattleshipDataConverter } from '../dataEntities/battleshipData'
import { db } from './firebase'

const COLLECTION_ID = 'battleships'

export const getBattleships = async function (gameId, userId) {
  const result = []
  const q = query(
    collection(db, COLLECTION_ID),
    where('gameId', '==', gameId),
    where('playerId', '==', userId))
  try {
    console.log('TTTT')
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
 * Returns a Battleship instance
 *
 * @param {BattleshipData} battleshipData a BattleshipData instance
 * @returns
 */
export const addOrUpdateBattleshipData = async function (battleshipData) {
  const docRef = await addDoc(collection(db, COLLECTION_ID).withConverter(BattleshipDataConverter), battleshipData)
  battleshipData.id = docRef.id
  return battleshipData
}

/**
 * Returns the default start battleships
 *
 * @param {*} gameData
 * @param {*} playerId
 * @returns
 */
export const getDefaultBattleshipsForPlayer = function (gameData, playerId) {
  // Check this player is part of the game
  if (gameData.player1 === playerId || gameData.player2 === playerId) {
    return [
      new BattleshipData({ location: { row: 2, column: 2 }, length: 5, vertical: false, gameId: gameData.id, playerId }),
      new BattleshipData({ location: { row: 4, column: 2 }, length: 4, vertical: false, gameId: gameData.id, playerId }),
      new BattleshipData({ location: { row: 6, column: 2 }, length: 3, vertical: false, gameId: gameData.id, playerId }),
      new BattleshipData({ location: { row: 6, column: 6 }, length: 3, vertical: false, gameId: gameData.id, playerId }),
      new BattleshipData({ location: { row: 8, column: 2 }, length: 2, vertical: false, gameId: gameData.id, playerId })
    ]
  } else {
    return []
  }
}
