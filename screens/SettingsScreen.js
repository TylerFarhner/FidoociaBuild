import React, { useState, useEffect } from 'react'
import { Text, View, Dimensions, StyleSheet, SafeAreaView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { TouchableOpacity } from 'react-native-gesture-handler'
import { signOutUser } from '../utils/firebase'

function SettingsScreen({ route, navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phoneNum, setPhone] = useState('')
  const [time, setTime] = useState(0)

  useEffect(() => {
    AsyncStorage.getItem('@userCreds').then((data) => {
      const { email } = JSON.parse(data)
      const { password } = JSON.parse(data)
      const { phoneNum } = JSON.parse(data)
      const { defaultTime } = JSON.parse(data)

      setEmail(email)
      setPassword(password)
      setPhone(phoneNum)

      // if the user has set a default time, use it. If not default to 15 minutes
      defaultTime ? setTime(defaultTime) : setTime(15)
    })
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          alignItems: 'center',
          width,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingBottom: height / 200,
        }}
      >
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back-outline"
          size={width / 14}
          color={'white'}
          style={{ paddingLeft: 12 }}
        />
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{ fontSize: width / 20, fontWeight: '500', color: 'white' }}
          >
            Account Settings
          </Text>
        </View>
        <View style={{ width: width / 14 }} />
      </View>
      <View
        style={{
          paddingTop: height / 10,
          width,
          height,
          backgroundColor: '#e8e8e8',
        }}
      >
        <View
          style={{
            width,
            marginBottom: height / 250,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            paddingVertical: height / 100,
            paddingHorizontal: width / 25,
          }}
        >
          <Text
            style={{ color: 'black', fontSize: width / 22, fontWeight: '400' }}
          >
            Email
          </Text>
          <Text
            style={{
              color: 'slategray',
              fontSize: width / 22,
              fontWeight: '400',
            }}
          >
            {email}
          </Text>
        </View>
        <View
          style={{
            width,
            marginBottom: height / 250,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            paddingVertical: height / 100,
            paddingHorizontal: width / 25,
          }}
        >
          <Text
            style={{ color: 'black', fontSize: width / 22, fontWeight: '400' }}
          >
            Password
          </Text>
          <Text
            style={{
              color: 'slategray',
              fontSize: width / 22,
              fontWeight: '400',
            }}
          >
            {password}
          </Text>
        </View>
        <View
          style={{
            width,
            marginBottom: height / 250,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            paddingVertical: height / 100,
            paddingHorizontal: width / 25,
          }}
        >
          <Text
            style={{ color: 'black', fontSize: width / 22, fontWeight: '400' }}
          >
            Phone Number
          </Text>
          <Text
            style={{
              color: 'slategray',
              fontSize: width / 22,
              fontWeight: '400',
            }}
          >
            {phoneNum}
          </Text>
        </View>
        <View
          style={{
            width,
            marginBottom: height / 250,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            backgroundColor: 'white',
            paddingVertical: height / 100,
            paddingHorizontal: width / 25,
          }}
        >
          <Text
            style={{ color: 'black', fontSize: width / 22, fontWeight: '400' }}
          >
            Default Time Extension
          </Text>
          <Text
            style={{
              color: 'slategray',
              fontSize: width / 22,
              fontWeight: '400',
            }}
          >
            {time + ' minutes'}
          </Text>
        </View>
        <View
          style={{
            width,
            marginTop: height / 30,
            alignItems: 'center',
            backgroundColor: 'white',
            paddingVertical: height / 100,
            paddingHorizontal: width / 25,
          }}
        >
          <Text
            style={{ color: 'red', fontSize: width / 22, fontWeight: '400' }}
          >
            Logout
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: 'red', padding: 20 }}
            onPress={signOutUser}
          ></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#198cff',
  },
})

export default SettingsScreen
