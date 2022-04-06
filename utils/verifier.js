import { db } from './firebase';
let state = {currentUser: null, verifications: []};

/**
 * Will add a new message to the notifications tab
 *  All notifications messages are stored in firestore
 * @param  {[String]} text [the message you are sending to the user]
 */
async function sendMessage(text) {
  text = String(text); // casting to String type 
  let u = () => String((((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1));
  let _id = `${u() + u()}-${u()}-${u()}-${u()}-${u() + u() + u() + u()}`;
  let notification = {
    _id,
    createdAt: new Date(),
    date: 'Solana',
    text,
    user: { _id: 'admin', name: 'admin' },
  };
  db.collection('users')
    .doc(state.currentUser)
    .collection('notifications')
    .add(notification);
}

/**
 * This function is listening for changes in firestore to the verifications
 * NOTE: That a message is ONLY sent out when a 'checked' paramater is true 
 * @param  {[String]} user [this will return the uid of the user in firebase (firestore and realtime)]
 * @param  {[Function]} callback [this will update the state of the verifications]
 */
export async function retrieveVerifications(user, callback) {
  state.currentUser = user;
  db.collection('users')
    .doc(user)
    .collection('verification')
    .onSnapshot((snapshot) => {
      [...new Set(snapshot.docChanges())].forEach((change) => {
        let doc = change.doc.data();
        if (change.type === 'added' && !state.verifications.map((v) => v.prospect).includes(doc.prospect)) {
          state.verifications.push(doc);
        } else if (change.type === 'modified') {
          console.log('Hi there')
          let last = state.verifications.findIndex((v) => v.prospect == doc.prospect);
          console.log('HERE', state.verifications[last]);
          Object.keys(doc).forEach((key) => {
            let param =
            key.includes('valid') || key.includes('checked')
              ? key.split('d')[1]
              : '';
            if (state.verifications[last][key] != doc[key]) {
              state.verifications[last][key] = doc[key];
              let value = key.includes('checked')
                ? doc[`valid${param}`]
                : doc[key];
              if (doc[`checked${param}`] === true && typeof (doc[`checked${param}`]) == 'boolean') {
                // let message = `${doc.prospect}'s ${param} ` + value ? 'was verified. ✅' : 'could not be verified. ❌';
                // sendMessage(message);
              }
            }
          });
        }
      });
      console.log('retrieved verifications', state.verifications)
      callback(state.verifications);
      
    });
}