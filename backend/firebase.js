import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/database'

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

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app()
}

const db = app.firestore()
const rt = app.database()
const fire = firebase.database()
const auth = firebase.auth()
const img = app.storage().ref('user-images')

export { db, auth, img, fire, rt }
