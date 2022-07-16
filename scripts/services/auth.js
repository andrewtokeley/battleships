// import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { PlayerData } from '../dataEntities/playerData'
import { auth } from './firebase'
import { getPlayerData, addOrUpdatePlayerData } from './playerService'

export const signIn = function (store) {
  signInAnonymously(auth)
    .then(() => {
      // if we haven't set the current user details in the store...
      // Get additional data from the store, or create this new user in the store
      let playerName = null
      getPlayerData(auth.currentUser.uid).then((player) => {
        if (!player) {
        // add new player with default name
          playerName = 'Player' + Math.trunc(100 * Math.random(1))
          addOrUpdatePlayerData(new PlayerData({ id: auth.currentUser.uid, name: playerName }))
        } else {
          playerName = player.name
        }
        store.user = auth.currentUser
        console.log('storing player name ' + playerName)
        store.playerName = playerName
      })
    })
    .catch((error) => {
      console.error(error)
    // ...
    })
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('onAuthStateChanged')
  } else {
    // User is signed out
    console.log('logged out')
  }
})
