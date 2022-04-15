import React, { useState } from 'react'
import {
  Text,
  Alert,
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native'
import Button from '../components/Button'
import { auth } from '../utils/firebase'
import { Input } from 'react-native-elements'
import AsyncStorage from '@react-native-async-storage/async-storage'

function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNum, setPhoneNum] = useState('')
  const [imageURL, setImageUrl] = useState('')

  const [validFN, setValidFN] = useState(true)
  const [validLN, setValidLN] = useState(true)
  const [validPhone, setValidPhone] = useState(true)
  const [validEmail, setValidEmail] = useState(true)
  const [validPW, setValidPW] = useState(true)

  /**
   * Will test the format of the submitted email string
   * @param  {String} emailString A string input
   * @return {Boolean}      Will return true/false if the string is an email
   */
  const validateEmail = (emailString) => {
    var re = /\S+@\S+\.\S+/
    console.log('Register Screen :', emailString, re.test(emailString))
    return re.test(emailString)
  }

  /**
   * Will set the flags to display an error message if the user
   * does not fill out all registration fields properly
   */
  const validateFields = () => {
    console.log('Register Screen : validateFields ran')
    setValidFN(true)
    setValidLN(true)
    setValidPhone(true)
    setValidEmail(true)
    setValidPW(true)

    if (name == '' || name.length < 2) {
      setValidFN(false)
      return false
    }
    if (lastName == '' || lastName.length < 2) {
      setValidLN(false)
      return false
    }
    if (phoneNum == '' || phoneNum.length < 8) {
      setValidPhone(false)
      return false
    }
    if (password == '' || password.length < 8) {
      setValidPW(false)
      return false
    }
    if (email == '' || validateEmail(email) == false) {
      setValidEmail(false)
      return false
    }

    console.log('FLAGS', validFN, validLN, validPhone, validEmail, validPW)
    console.log(
      'Results:',
      '\nEmail: ' + email,
      '\nFirst Name: ' + name,
      '\nLast Name: ' + lastName,
      '\nPhone Number: ' + phoneNum,
      '\nPassword Length: ' + password.length
    )
    console.log('Register Screen :validateFields done')

    return true
  }

  const register = () => {
    console.log('Register Screen :Register Ran')
    var isValid = validateFields()
    if (!isValid) {
      Alert.alert(
        'Incomplete Profile',
        'Please make sure all fields are filled out properly'
      )
    } else {
      AsyncStorage.setItem(
        '@userCreds',
        JSON.stringify({ email, password, name, lastName, phoneNum })
      ).then(() =>
        auth.createUserWithEmailAndPassword(email, password).catch((error) => {
          var emailInUse = 'The email address is already in use.'
          if (error.message == emailInUse) {
            Alert.alert(
              'Email in Use',
              'There is already an account using this email address. Try signing in or using a different email address.'
            )
          } else {
            Alert.alert('Registration Issue', error.message)
          }
        })
      )
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEE' }}>
      <ScrollView scrollEnabled={true} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Register</Text>
        <Input
          placeholder="John"
          label="First Name"
          leftIcon={{ type: 'material', name: 'badge', size: width / 20 }}
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        {validFN ? null : (
          <Text style={styles.errorMsg}>Please enter a valid first name.</Text>
        )}
        <Input
          placeholder="Smith"
          label="Last Name"
          leftIcon={{ type: 'material', name: 'badge', size: width / 20 }}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          style={styles.input}
        />
        {validLN ? null : (
          <Text style={styles.errorMsg}>Please enter a valid last name.</Text>
        )}
        <Input
          placeholder="johnsmith@domain.com"
          label="Email"
          leftIcon={{ type: 'material', name: 'email', size: width / 20 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          importantForAutofill="auto"
          keyboardType="email-address"
          maxLength={50}
          returnKeyType="next"
          textContentType="emailAddress"
        />
        {validEmail ? null : (
          <Text style={styles.errorMsg}>
            Please enter a valid email address.
          </Text>
        )}
        <Input
          placeholder="Enter a password"
          label="Password"
          leftIcon={{ type: 'material', name: 'lock', size: width / 20 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          autoCompleteType="password"
          autoCorrect={false}
          importantForAutofill="auto"
          maxLength={100}
          returnKeyType="next"
          textContentType="password"
          style={styles.input}
        />
        {validPW ? null : (
          <Text style={styles.errorMsg}>
            Your password needs to be at least 8 characters.
          </Text>
        )}
        <Input
          placeholder="+1 (123) 123 4567"
          label="Phone Number"
          leftIcon={{ type: 'material', name: 'phone', size: width / 20 }}
          value={phoneNum}
          onChangeText={(text) => setPhoneNum(text)}
          autoCompleteType="tel"
          keyboardType="phone-pad"
          autoCorrect={false}
          importantForAutofill="auto"
          maxLength={15}
          returnKeyType="next"
          textContentType="telephoneNumber"
          style={styles.input}
        />
        {validPhone ? null : (
          <Text style={styles.errorMsg}>
            Your phone number needs to be at least 10 digits.
          </Text>
        )}
        <View style={{ width: width * 0.85, marginTop: height / 20 }}>
          <Button label="Register" onPress={register} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  errorMsg: {
    color: 'red',
    marginTop: -height / 50,
    marginBottom: height / 50,
    paddingLeft: width * 0.02,
  },
  input: {
    paddingLeft: width * 0.01,
    fontSize: width / 25,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: width * 0.05,
  },
  title: {
    fontSize: width / 12,
    fontWeight: 'bold',
    marginBottom: height / 30,
    marginLeft: width / 35,
  },
})

export default RegisterScreen
