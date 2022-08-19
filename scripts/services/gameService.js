
import { onSnapshot, updateDoc, getDoc, doc, setDoc, deleteDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { GameDataConverter } from '../dataEntities/gameData'
import { GameFullError, GameCantBeJoinedError, GameDefaultError, GameDoesNotExistError } from '../Types'
import { db } from './firebase'
import { deleteBattleships } from './battleshipService'
import { deleteShots } from './shotService'
import { deleteMessages } from './messageService'

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
  // delete battleships
  const _deleteBattleships = deleteBattleships(id)
  // delete shots
  const _deleteShots = deleteShots(id)

  // delete messages
  const _deleteMessages = deleteMessages(id)

  // delete from game collection
  const ref = doc(db, COLLECTION_ID, id)
  const _deleteGame = deleteDoc(ref)

  return Promise.all([_deleteBattleships, _deleteShots, _deleteMessages, _deleteGame])
}

/**
 * Resolves with the GameData associated with the gameId. If no game exists the method will still resolve but with null.
 * @param {*} id
 * @returns
 */
export const getGameData = async function (id) {
  console.log('gamedata')
  const ref = doc(db, COLLECTION_ID, id).withConverter(GameDataConverter)
  const docSnap = await getDoc(ref)
  if (docSnap.exists()) {
    return docSnap.data()
  } else {
    return null
  }
}

/**
 * Get the stats for the two players
 * @param {*} id
 * @param {*} ownerId
 * @param {*} opponentId
 * @returns an object with properties; numberOfGamesPlayed, player1Won, player2Won
 */
export const getBattleStatistics = async function (playerId1, playerId2) {
  const result = {
    numberOfGamesPlayed: 0,
    player1Won: 0,
    player2Won: 0
  }
  const ref = collection(db, COLLECTION_ID)
  const q1 = getDocs(query(ref, where('ownerId', '==', playerId1), where('opponentId', '==', playerId2)).withConverter(GameDataConverter))
  const q2 = getDocs(query(ref, where('ownerId', '==', playerId2), where('opponentId', '==', playerId1)).withConverter(GameDataConverter))
  const [snapshot1, snapshot2] = await Promise.all([q1, q2])

  const q1Docs = snapshot1.docs.map(s => s.data())
  const q2Docs = snapshot2.docs.map(s => s.data())
  const gamesPlayed = q1Docs.concat(q2Docs)

  result.numberOfGamesPlayed = q1Docs.length + q2Docs.length
  result.player1Won = gamesPlayed.filter(g => g.winnerId === playerId1).length
  result.player2Won = gamesPlayed.filter(g => g.winnerId === playerId2).length

  return result
}

/**
 * Restarts a game by removing all shots and battleships and clearing the opponent
 * @param {*} id the game id
 * @returns
 */
export const restartGame = function (id) {
  // delete battleships
  const _deleteBattleships = deleteBattleships(id)
  // delete shots
  const _deleteShots = deleteShots(id)

  // remove the opponent from the game
  const ref = doc(db, COLLECTION_ID, id)
  const _removeOpponent = updateDoc(ref, { opponentId: null })

  return Promise.all([_deleteBattleships, _deleteShots, _removeOpponent])
}

/**
 * Join the user to a game
 *
 * @param {*} gameId id of the game
 * @param {*} userid id of the user joining
 */
export const joinGame = async function (gameId, userId) {
  const gameData = await getGameData(gameId)
  // can join if a game exists, there's no other opponenent, or if you are the opponent already
  if (gameData && (!gameData.opponentId || gameData.opponentId === userId)) {
    // can join
    gameData.opponentId = userId
    return await addOrUpdateGameData(gameData)
  } else if (!gameData) {
    throw new GameDoesNotExistError(gameId)
  } else if (gameData.ownerId === userId) {
    throw new GameCantBeJoinedError(gameId)
  } else if (gameData.opponentId) {
    throw new GameFullError(gameId)
  } else {
    return new GameDefaultError(gameId, 'Not sure what happend there!')
  }
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
