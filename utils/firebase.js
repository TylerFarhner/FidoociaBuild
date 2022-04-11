import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

// credentials to access our specific database
var firebaseConfig = {
  apiKey: 'AIzaSyBd-PnyS7vvBX1eP5pdRh7aObdYUBycrOw',
  authDomain: 'fidoocia-e9f07.firebaseapp.com',
  databaseURL: 'https://fidoocia-e9f07-default-rtdb.firebaseio.com',
  projectId: 'fidoocia-e9f07',
  storageBucket: 'fidoocia-e9f07.appspot.com',
  messagingSenderId: '478797659819',
  appId: '1:478797659819:web:89aaf536efd167967641ee',
}

// Initialize Firebase
let app
switch (firebase.apps.length) {
  case 0:
    app = firebase.initializeApp(firebaseConfig)
    break
  case 'default':
    app = firebase.app()
    break
}

const rt = app.database()
const db = app.firestore()
const img = app.storage().ref('user-images')
const auth = firebase.auth()
const fire = firebase.database()

export const signOutUser = async () => {
  try {
    await auth().signOut()
  } catch (error) {
    console.log(error)
  }
  console.log('bang')
}

export { db, auth, img, fire, rt }
