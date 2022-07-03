// import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from '../../store/userStore'
import { auth } from './firebase'

signInAnonymously(auth)
  .then(() => {
    // Signed in..
    console.log('logged in')
  })
  .catch((error) => {
    console.error(error)
    // ...
  })

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Set the user object into the userStore
    const store = useUserStore()
    store.user = user
  } else {
    // User is signed out
    // ...
  }
})
