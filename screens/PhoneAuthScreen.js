import React, { useEffect } from 'react'
import { Text, View, TextInput, Dimensions } from 'react-native'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import * as firebase from 'firebase'
import { rt, auth, db } from '../utils/firebase'
import AsyncStorage from '@react-native-async-storage/async-storage'

const PhoneAuthScreen = ({ navigation }) => {
  const recaptchaVerifier = React.useRef()
  const [verificationId, setVerificationId] = React.useState()
  const [verificationCode, setVerificationCode] = React.useState()
  const firebaseConfig = firebase.app().options

  useEffect(() => {
    // since Firebase doesn't allow you to confirm a phone number
    // as a way of confirming a new account, we confirm the
    // phone number and firebase uses that as the new user's ID
    // instead of an email, then when the user logs in for the
    // first time we associate the email they entered to their
    // firebase account (and subsequently their phone number)
    const phoneProvider = new firebase.auth.PhoneAuthProvider()

    AsyncStorage.getItem('@userCreds').then((data) => {
      const { phoneNum } = JSON.parse(data)
      phoneProvider
        .verifyPhoneNumber(`+1${phoneNum}`, recaptchaVerifier.current)
        .then((id) => setVerificationId(id))
    })
  }, [])

  const confirmCode = (code) => {
    const credential = firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    )
    firebase
      .auth()
      .currentUser.linkWithCredential(credential)
      .then(() => {
        AsyncStorage.getItem('@userCreds').then((data) => {
          const { imageURL } = JSON.parse(data)
          const { name } = JSON.parse(data)
          const { lastName } = JSON.parse(data)
          const { email } = JSON.parse(data)

          db.collection('users')
            .doc(auth.currentUser.uid)
            .set({
              firstName: name,
              lastName,
              profileImg: imageURL ? imageURL : '',
            })
        })
      })
      .then(() => navigation.replace('Root'))
  }

  const updateVerificationCode = (val) => {
    setVerificationCode(val)
    if (val.length === 6) {
      confirmCode(val)
    }
  }

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        //attemptInvisibleVerification={false}
      />
      <Text style={styles.title}>Verify Phone</Text>
      <Text style={styles.instructions}>
        A code has been sent to the supplied phone number. Enter the code below
        to create your account.
      </Text>
      <TextInput
        placeholder="_ _ _ _ _ _"
        style={styles.codeInput}
        value={verificationCode}
        onChangeText={updateVerificationCode}
        caretHidden
        autoCorrect={false}
        keyboardType="number-pad"
        importantForAutofill="auto"
        maxLength={6}
        returnKeyType="go"
        textContentType="oneTimeCode"
      />
    </View>
  )
}

const { width, height } = Dimensions.get('window')
const styles = {
  container: {
    flex: 1,
    marginTop: height / 8,
    marginHorizontal: width / 15,
  },
  title: {
    fontSize: width / 10,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: height / 20,
  },
  instructions: {
    fontSize: width / 22,
    fontWeight: '500',
    marginBottom: height / 10,
  },
  codeInput: {
    fontSize: width / 7,
    textAlign: 'center',
  },
}

export default PhoneAuthScreen
