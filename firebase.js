import * as firebase from "firebase";
import "@firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBd-PnyS7vvBX1eP5pdRh7aObdYUBycrOw",
  authDomain: "fidoocia-e9f07.firebaseapp.com",
  databaseURL: "https://fidoocia-e9f07-default-rtdb.firebaseio.com",
  projectId: "fidoocia-e9f07",
  storageBucket: "fidoocia-e9f07.appspot.com",
  messagingSenderId: "478797659819",
  appId: "1:478797659819:web:89aaf536efd167967641ee",
};

firebase.initializeApp(firebaseConfig);

export default firebase;
