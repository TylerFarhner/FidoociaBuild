import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  Alert,
  Pressable,
  Modal,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Button from '../components/Button'
import { auth, db } from '../utils/firebase'
import Verifier from '../utils/verifier'
import { Input } from 'react-native-elements'

function DateProfileScreen(props) {
  const { route, navigation, verifications } = props
  const {
    // itemId,
    name,
    lastName,
    age,
    startTime,
    endTime,
    profileImage,
    location,
    contacts,
    isDateValid,
    date,
    dateImg,
    phoneNumber,
    ref,
  } = route.params
  // let newVerifications;
  // let verified = verifications.find((x) => x.prospect == name) || {};
  // keys.forEach((x) =>
  //   Object.keys(verified).includes(x) ? null : (verified[x] = false)
  // );
  let state = { ...route.params }
  state.dateImg =
    !dateImg || dateImg.length == 0
      ? 'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg'
      : dateImg
  // if (!validName || !validAge || !validPhone) {
  // console.log(verified, name, validName, validAge, validPhone);
  // console.log('This view is missing important state values, !validName || !validAge || !validPhone');
  // return;
  // }

  //////// save to navigate //////////
  /*
  navigation.navigate('Edit', {
    name: name,
    lastName: lastName,
    age: age,
    startTime: startTime,
    endTime: endTime,
    location: location,
    profileImage: profileImage,
    contacts: contacts,
    isDateValid: isDateValid,
    date: date,
    verifications: current,
    phoneNumber: phoneNumber
  })
  */
  ///////////////////////////////

  const firebase = require('firebase') // this is needed for reauthentication
  const [password, setPassword] = useState('')
  const [isModalOpen, setModalOpen] = useState(false)
  const [datePassed, setDatePassed] = useState(false)

  var user = auth.currentUser
  var credential = firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  )

  /** This is wil trigger the modal to pop-up and request the user enters their password
   * before allowing them to navigate to the EditScreen to modify their date's profile. */
  const reauthenticate = () => {
    user.reauthenticateWithCredential(credential).then(
      () => {
        setModalOpen(false)
        console.log('Success!')
        navigation.navigate('Edit', {
          name: name,
          lastName: lastName,
          age: age,
          startTime: startTime,
          endTime: endTime,
          location: location,
          profileImage: profileImage,
          contacts: contacts,
          isDateValid: isDateValid,
          date2: date,
          phoneNumber: phoneNumber,
          dateImg: dateImg,
          ref: ref,
          ...state,
        })
      },
      () => {
        alert('Incorrect Password')
      }
    )
  }

  /** This will give you the current date in YYYY-MM-DD format */
  const currentDay = () => {
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()
    today = yyyy + '-' + mm + '-' + dd
    console.log('TODAY', today)
    return today
  }

  /**
   * Will return whether or not the firstDate is a date in the past
   * @constructor
   * @param {Date} queryDate - The 'past' date in question
   * @param {Date} currentDate - The date you are checking against
   * @returns {boolean}
   */
  const dateInPast = (queryDate, currentDate) => {
    if (queryDate.setHours(0, 0, 0, 0) <= currentDate.setHours(0, 0, 0, 0)) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    let today = new Date(currentDay())
    const past = new Date(date)

    if (dateInPast(past, today)) {
      setDatePassed(true)
    }
  }, [])

  useEffect(() => {
    // newVerifications = Verifier.state ? Verifier.state.verifications : null;
    // console.log(newVerifications);
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
          width,
          alignItems: 'flex-start',
          paddingLeft: width / 20,
          paddingTop: height / 50,
        }}
      >
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back-outline"
          size={width / 12}
          style={{ alignSelf: 'flex-start' }}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.titleText}>
          {name}{' '}
          {lastName && lastName.length > 0 && lastName.substring(0, 1) + '. ,'}{' '}
          {age}{' '}
          {true ? (
            <Ionicons
              name="shield-checkmark"
              size={width / 15}
              style={styles.verifiedIcon}
            />
          ) : (
            <Ionicons
              name="alert-circle"
              size={width / 10}
              style={styles.searchingIcon}
            />
          )}
        </Text>
      </View>
      <Image
        style={styles.tinyLogo}
        source={{
          uri: state.dateImg,
        }}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          setModalOpen(!isModalOpen)
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
          onPress={() => setModalOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: '#FFF',
              borderRadius: 8,
              paddingTop: 30,
              paddingHorizontal: 30,
              paddingBottom: 10,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
              margin: 40,
            }}
          >
            <Text
              style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}
            >
              Confirm Password{' '}
            </Text>
            <Text style={{ fontSize: 14.5, marginBottom: 30 }}>
              Please re-enter your password to continue.{' '}
            </Text>
            <Input
              placeholder="Enter your password"
              label="Password"
              leftIcon={{ type: 'material', name: 'lock' }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              autoCompleteType="password"
              autoCorrect={false}
              importantForAutofill="auto"
              maxLength={100}
              returnKeyType="go"
              textContentType="password"
              containerStyle={{ marginBottom: 20 }}
            />
            <Button
              label="Submit"
              onPress={() => {
                reauthenticate()
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <View style={styles.infoContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name="time"
              size={width / 22}
              style={styles.emergencyContactsIcon}
            />
            <Text style={styles.infoText}>{startTime}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <Ionicons
              name="calendar"
              size={width / 22}
              style={styles.emergencyContactsIcon}
            />
            <Text style={styles.infoText}>{date}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 12 }}>
          <Ionicons
            name="navigate"
            size={width / 22}
            style={styles.emergencyContactsIcon}
          />
          <Text style={styles.infoText}>{location.name}</Text>
        </View>

        {contacts.map((contact, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => Linking.openURL(`tel:${contact.phoneNumber}`)}
          >
            <View style={{ flexDirection: 'row', marginVertical: 8 }}>
              {/* style={styles.emergencyContacts} */}
              <Ionicons name="call" size={22} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 18 }}>{contact.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ width: width * 0.85 }}>
        <Button
          onPress={() => {
            setPassword('')
            setModalOpen(true)
          }}
          label="Edit Date"
        />
      </View>

      {/* <Button  label='View Status' width={275} onPress={() => navigation.navigate('Status', {...state, date2: date, verifications: verified})}/> */}
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  date: {
    marginBottom: 30,
  },
  infoContainer: {
    marginBottom: height / 50,
    borderColor: 'slategray',
    borderWidth: StyleSheet.hairlineWidth,
    lineHeight: width / 22,
    fontSize: width / 28,
    backgroundColor: 'white',
    color: 'black',
    padding: 20,
    width: 275,
    borderRadius: width / 75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyContacts: {
    marginBottom: height / 75,
  },
  emergencyContactsIcon: {
    marginRight: 5,
  },
  verifiedIcon: {
    color: 'blue',
    marginLeft: 8,
  },
  searchingIcon: {
    color: 'red',
    marginLeft: 10,
  },
  titleText: {
    fontSize: width / 15,
    fontWeight: 'bold',
    paddingBottom: height / 50,
  },
  infoText: {
    fontSize: 16,
  },
  tinyLogo: {
    width: 275,
    height: 275,
    borderRadius: width / 30,
    marginBottom: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})

export default DateProfileScreen
