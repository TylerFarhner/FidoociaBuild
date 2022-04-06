// Library Imports
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Text, Image, View, StyleSheet, SafeAreaView, Dimensions, Alert } from 'react-native'
import { Input } from 'react-native-elements'
import { format } from 'date-fns';
import DropDownPicker from "react-native-dropdown-picker";
import * as Location from 'expo-location'

// Application Imports
import { auth, fire, db } from '../utils/firebase'
import { now, timeFromNow, toHHMMSS } from '../utils/helpers'

// Component Imports
import Button from '../components/Button'

// This screen is responsible for allowing the user to share their location with their friends
// send alerts, and close your date profile once the date is over with an access code 
function CheckOutScreen(props) {
  const { location, activeDate, setActiveDate, route, navigation } = props; // should move location to app.js, retrieve through props
  const {
    // itemId,
    name,
    lastName,
    age,
    startTime,
    endTime,
    profileImage,
    contacts,
    isDateValid,
    date,
    dateImg,
    phoneNumber,
    ref,
  } = route.params;
  const [secretCode, setSecret] = useState(12345) // TODO: Replace with actual generated code 
  const [codeInput, setCodeInput] = useState(56789) // TODO: Replace with actual generated code 
  const [errorMsg, setErrorMsg] = useState(null)
  const [timer, setTimer] = useState(60 * 60 * 2);
  const [sharing, setSharing] = useState(false);
  const [items, setItems] = useState([]);

  /* For Dropdown */
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [loading, setLoading] = useState(false)



  const currentDay = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    console.log('TODAY', today)
    return today;
  }

  const reformatTime = timeString => {
    let formatted = ''
    if (timeString.length == 6) {
      formatted = timeString.substring(0, 4) + ' ' + timeString.substring(4, timeString.length)
      return formatted
    } else {
      formatted = timeString.substring(0, 5) + ' ' + timeString.substring(5, timeString.length)
      return formatted
    }
  }

  const sortByTime = json => {
    for (const property in json) {
      if (json[property].length > 1) {
        // console.log('This has more than one date event', json[property])
        json[property].sort((a, b) => {
          return (
            new Date('1970/01/01 ' + reformatTime(a.startTime)) -
            new Date('1970/01/01 ' + reformatTime(b.startTime))
          )
        })
        // console.log('After time sort', json[property])
      }
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setErrorMsg(
        'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
      )
      return
    }

    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }
    })

    Location.getCurrentPositionAsync({}).then(location => {
      setCurrentLocation(location)
      let { coords } = location
    })
  }, [])

  /* VIEW FUNCTIONS */
  const generateSecret = () => {
    setSecret(Math.floor(Math.random() * 90000) + 10000)
    console.log('CODE', secretCode, 'User Location Info', ...location.coords)
  }

  /**
 * Will toggle screen between active dates and 'no active dates' 
 */
  const checkOut = () => {
    if (activeDate) {
      console.log(`checking date for code ${codeInput}`, codeInput, activeDate)
      switch (codeInput == secretCode) {
        case true:
          activeDate.start = false;
          console.log('success')
          break
        case false:
          console.log('failure')
          break
      }
    }
  }

  const stopSharingLocation = () => {
    console.log('Stop Sharing Location called')
        setSharing(false)
        //db.collection('users').doc(auth.currentUser.uid).collection('dates').doc(`${name} ${lastName}`).update({ activeLocation: null });
        setValue(null);
        Alert.alert("Location Update", 'Your location is no longer being shared with your emergency contacts.')
        navigation.pop();
  }

  useEffect(() => {
    let interval = null;
    if (sharing) {
      interval = setInterval(() => {
        // setSeconds(seconds => seconds + 1);
        Location.getCurrentPositionAsync({}).then(location => {
          setCurrentLocation(location)
          let { coords } = location
          //db.collection('users').doc(auth.currentUser.uid).collection('dates').doc(`${name} ${lastName}`).update({ activeLocation: { lat: currentLocation.coords.latitude, long: currentLocation.coords.longitude } });
          console.log(currentLocation.coords.latitude, currentLocation.coords.longitude)
        })
      }, 1000);
    } else if (!sharing) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sharing]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>

        <View>
          <Image source={require('../images/shl.gif')} />
          <Text style={styles.shareLabel}>You are now sharing your location with {contacts[0].name}, {contacts[1].name} and {contacts[2].name}</Text>
        </View>
        <View style={{ marginTop: height / 6, width: width * 0.85 }}>
          <Button label='Stop Sharing' onPress={stopSharingLocation} />
        </View>
      </View>
    </SafeAreaView>
  )
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  button: { width: 200, marginTop: 10 },
  input: { paddingLeft: 8 },
  dateImage: {
    opacity: 0.8,
    marginTop: 10,
    width: width / 3.5,
    height: width / 3.5,
    borderRadius: width / 4
  },
  shareLabel: {
    fontSize: 20,
    marginBottom: 15,
    alignSelf: "center"
  },
  formLabel: {
    fontSize: 20,
    marginBottom: 15
  },
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 35,
    marginTop: 100
  },
  title: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    color: '#888'
  },
  name: {
    fontSize: 30,
    marginTop: 10,
    fontWeight: 'bold'
  }
})

export default CheckOutScreen