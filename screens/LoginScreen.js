import React, { useState } from 'react'
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native'
import Button from '../components/Button'
import { auth } from '../utils/firebase'
import { Input } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password).catch((error) => {
      var errorMessage = error.message
      var noAccountErrorMessage =
        'There is no user record corresponding to this identifier. The user may have been deleted.'
      if (errorMessage == noAccountErrorMessage) {
        Alert.alert(
          'Whoops!',
          "We don't have record of that account. \n\nCheck that you typed everything correctly, or register if you don't have an account yet :)"
        )
      } else {
        alert(errorMessage)
      }
    })
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEE' }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Image
          source={require('../images/fidologo.png')}
          style={{ width: width / 3, height: width / 3 }}
        />
        <Text style={styles.titleText}>Fidoocia</Text>
      </View>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={styles.container}
      >
        <Input
          placeholder="Enter your email"
          label="Email"
          leftIcon={{ type: 'material', name: 'email', size: width / 20 }}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize="none"
          autoCompleteType="email"
          autoCorrect={false}
          importantForAutofill="auto"
          keyboardType="email-address"
          maxLength={50}
          returnKeyType="next"
          textContentType="emailAddress"
          style={styles.input}
        />
        <Input
          placeholder="Enter your password"
          label="Password"
          leftIcon={{ type: 'material', name: 'lock', size: width / 18 }}
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          autoCompleteType="password"
          autoCorrect={false}
          importantForAutofill="auto"
          maxLength={100}
          returnKeyType="go"
          textContentType="password"
          containerStyle={{ marginBottom: height / 40 }}
          style={styles.input}
        />
        <View style={{ width: width * 0.85, marginTop: height / 25 }}>
          <Button label="Sign In" onPress={signIn} />
          <Button
            label="Register"
            noFill
            onPress={() => navigation.navigate('Register')}
          />
        </View>
      </ScrollView>
      <Button
        noFill
        label="Forgot password?"
        labelStyle={{ fontSize: width / 25, alignSelf: 'center' }}
        onPress={() => navigation.navigate('ResetPassword')}
      />
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  input: {
    paddingLeft: width * 0.01,
    fontSize: width / 25,
  },
  titleText: {
    fontSize: width / 7,
    fontWeight: 'bold',
    color: '#333',
    marginTop: height / 35,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: width * 0.075,
    marginTop: height / 10,
    paddingBottom: height / 20,
  },
})

export default LoginScreen
