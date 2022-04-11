import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  Dimensions,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { auth, fire } from '../utils/firebase'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

// The status screen is responsible for showing the user which parameters of their date has been verified.
function StatusScreen({ route, navigation }) {
  const verified = route.params.verified // when working, it should pull the most up-to-date verifications
  const {
    image,
    name,
    age,
    lastName,
    phoneNumber,
    profileImage,
    ref,
    dateImg,
  } = route.params
  const [dateName, setName] = useState('')
  const [report, setReport] = useState('')
  let { validAge, validName, validLastName, validPhone } = verified

  /**
   * Firebase listener to update the detailed report text area
   * with new information submitted from the admin console (separate web app)
   */
  useEffect(() => {
    fire
      .ref(`users/${auth.currentUser.uid}/dates/${ref}/detailedReport`)
      .on('value', (ss) => {
        let newReport = ss.val()
        if (newReport == null) {
          setReport(
            'Any important information found such as violent crimes will be reported here. Please check back again later.'
          )
        } else {
          console.log('newReport', newReport)
          setReport(newReport.report)
        }
      })
  }, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: width / 200,
          width,
          paddingHorizontal: width / 20,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row' }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={width / 10} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginVertical: height / 10,
          backgroundColor: 'white',
          width: width / 3.5,
          height: width / 3.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {false ? (
          <Image
            source={{ uri: image }}
            style={{
              width: width / 3,
              height: width / 3,
              borderRadius: width / 4,
            }}
          />
        ) : (
          <Image
            source={{
              uri: dateImg
                ? `${dateImg}`
                : 'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg',
            }}
            style={{
              width: width / 2,
              height: width / 2,
              borderRadius: width / 4,
            }}
          />
        )}
      </View>

      <ScrollView
        style={{ height: '60%' }}
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          autoFocus
          value={name}
          placeholder="Full Name"
          placeholderTextColor={'slategray'}
          autoCapitalize="words"
          autoCorrect={false}
          editable={false}
          returnKeyType="next"
          onChangeText={(name) => setName(name)}
          style={{
            marginBottom: height / 50,
            borderColor: 'slategray',
            borderWidth: StyleSheet.hairlineWidth,
            lineHeight: width / 22,
            fontSize: width / 28,
            backgroundColor: 'white',
            color: 'black',
            paddingVertical: width / 25,
            paddingLeft: width / 50,
            width: width - 3 * (width / 20),
            borderRadius: width / 75,
          }}
        />
        {validName ? (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'blue' }}>
            First name was verified.
          </Text>
        ) : (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'red' }}>
            First name could not be verified.
          </Text>
        )}
        <TextInput
          autoFocus
          value={lastName}
          placeholder="Last Name"
          placeholderTextColor={'slategray'}
          autoCapitalize="words"
          autoCorrect={false}
          editable={false}
          returnKeyType="next"
          onChangeText={(name) => setName(name)}
          style={{
            marginBottom: height / 50,
            borderColor: 'slategray',
            borderWidth: StyleSheet.hairlineWidth,
            lineHeight: width / 22,
            fontSize: width / 28,
            backgroundColor: 'white',
            color: 'black',
            paddingVertical: width / 25,
            paddingLeft: width / 50,
            width: width - 3 * (width / 20),
            borderRadius: width / 75,
          }}
        />
        {validLastName ? (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'blue' }}>
            Last name was verified.
          </Text>
        ) : (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'red' }}>
            Last name could not be verified.
          </Text>
        )}
        <TextInput
          autoFocus
          value={age.toString()}
          placeholder="Age"
          placeholderTextColor={'slategray'}
          autoCapitalize="words"
          autoCorrect={false}
          editable={false}
          returnKeyType="next"
          onChangeText={(name) => setName(name)}
          style={{
            marginBottom: height / 50,
            borderColor: 'slategray',
            borderWidth: StyleSheet.hairlineWidth,
            lineHeight: width / 22,
            fontSize: width / 28,
            backgroundColor: 'white',
            color: 'black',
            paddingVertical: width / 25,
            paddingLeft: width / 50,
            width: width - 3 * (width / 20),
            borderRadius: width / 75,
          }}
        />
        {validAge ? (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'blue' }}>
            Age was verified.
          </Text>
        ) : (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'red' }}>
            Age could not be verified.
          </Text>
        )}
        <TextInput
          autoFocus
          value={phoneNumber}
          placeholder="Phone Number"
          maxLength={14}
          placeholderTextColor={'slategray'}
          autoCapitalize="words"
          keyboardType="phone-pad"
          autoCompleteType="tel"
          editable={false}
          autoCorrect={false}
          returnKeyType="next"
          onChangeText={(phoneNumber) => setPhoneNumber(phoneNumber)}
          style={{
            marginBottom: height / 50,
            borderColor: 'slategray',
            borderWidth: StyleSheet.hairlineWidth,
            lineHeight: width / 22,
            fontSize: width / 28,
            backgroundColor: 'white',
            color: 'black',
            paddingVertical: width / 25,
            paddingLeft: width / 50,
            width: width - 3 * (width / 20),
            borderRadius: width / 75,
          }}
        />
        {validPhone ? (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'blue' }}>
            Phone Number was verified.
          </Text>
        ) : (
          <Text style={{ marginTop: -10, marginBottom: 15, color: 'red' }}>
            Phone Number could not be verified.
          </Text>
        )}
        <TextInput
          placeholderTextColor={'slategray'}
          placeholder={report}
          multiline={true}
          editable={false}
          style={{
            marginBottom: height / 50,
            borderColor: 'slategray',
            borderWidth: StyleSheet.hairlineWidth,
            lineHeight: width / 22,
            fontSize: width / 28,
            backgroundColor: 'white',
            color: 'black',
            paddingVertical: width / 25,
            paddingLeft: width / 50,
            width: width - 3 * (width / 20),
            borderRadius: width / 75,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: { width, height },
  input: {
    paddingRight: 10,
    lineHeight: 23,
    flex: 2,
    textAlignVertical: 'top',
  },
})

export default StatusScreen
