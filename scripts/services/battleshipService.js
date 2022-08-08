import { writeBatch, collection, query, getDocs, where, doc, onSnapshot } from 'firebase/firestore'
import { BattleshipDataConverter } from '../dataEntities/battleshipData'
import { Battleship } from '../battleShip'
import { BattleshipType } from '../Types'
import { db } from './firebase'

const COLLECTION_ID = 'battleships'

/**
 * Listens for changes in battleships collection to indicate which players have saved their battleships.
 *
 * @param {*} gameId
 * @param {*} delegate - will be called if two players have created battleships for the game.
 * @returns a Promise which resolves to an array of player userIds
 */
export const attachBattleshipListener = function (gameId, delegate) {
  const q = query(collection(db, COLLECTION_ID).withConverter(BattleshipDataConverter), where('gameId', '==', gameId))
  return onSnapshot(q, (querySnapshot) => {
    const battleships = []
    querySnapshot.forEach((doc) => {
      battleships.push(doc.data())
    })
    // Check each player has the right number of battleships
    const uniquePlayerIds = [...new Set(battleships.map(b => b.playerId))]
    return delegate(uniquePlayerIds)
  })
}

/**
 * Deletes all the battleships for the user and game
 * @param {*} gameId
 * @param {*} userId
 * @returns Promise
 */
export const deleteBattleships = function (gameId, userId) {
  const batch = writeBatch(db)

  // delete from game collection
  const q = query(
    collection(db, COLLECTION_ID),
    where('gameId', '==', gameId))

  return getDocs(q).then(async (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.playerId === userId || !userId) {
        batch.delete(doc.ref)
      }
    })
    await batch.commit()
  })
}

/**
 * Returns a promise the resolves with the battleships for the given user and game
 * @param {*} gameId
 * @param {*} userId
 * @returns
 */
export const getBattleships = async function (gameId, userId) {
  const result = []
  const q = query(
    collection(db, COLLECTION_ID),
    where('gameId', '==', gameId),
    where('playerId', '==', userId)).withConverter(BattleshipDataConverter)
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
 * Adds the supplied battleships, deleting any that already exist for this game/user
 *
 * @param {*} battleships - array of BattleshipData elements
 * @returns
 */
export const addBattleships = async function (battleships) {
  const batch = writeBatch(db)

  const gameId = battleships[0].gameId
  const playerId = battleships[0].playerId
  if (!gameId || !playerId) {
    throw (new Error('Missing gameid or playerId from battleships'))
  }
  // delete any saved battleships
  await deleteBattleships(gameId, playerId)

  // add battleships
  battleships.forEach((b) => {
    const ref = doc(collection(db, COLLECTION_ID).withConverter(BattleshipDataConverter))
    batch.set(ref, b)
  })
  await batch.commit()
}

/**
 * Returns the default start battleships
 *
 * @param {*} gameData
 * @param {*} playerId
 * @returns
 */
export const getDefaultBattleships = function () {
  return [
    new Battleship({ type: BattleshipType.Carrier, name: BattleshipType.Carrier.name, location: { row: 2, column: 2 }, length: 5, vertical: false }),
    new Battleship({ type: BattleshipType.Battleship, name: BattleshipType.Battleship.name, location: { row: 4, column: 2 }, length: 4, vertical: false }),
    new Battleship({ type: BattleshipType.Cruiser, name: BattleshipType.Cruiser.name, location: { row: 6, column: 2 }, length: 3, vertical: false }),
    new Battleship({ type: BattleshipType.Submarine, name: BattleshipType.Submarine.name, location: { row: 6, column: 6 }, length: 3, vertical: false }),
    new Battleship({ type: BattleshipType.Destroyer, name: BattleshipType.Destroyer.name, location: { row: 8, column: 2 }, length: 2, vertical: false })
  ]
}
