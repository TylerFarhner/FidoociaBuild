import React, { useState, useEffect } from "react";
import { Text, Image, View, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity, Linking  } from "react-native";
import Button from "../components/Button";
import { auth, db, fire, img, rt } from "../utils/firebase";
import { Input } from "react-native-elements";
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Constants } from 'react-native-unimodules';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

function FriendScreen({ navigation }) {

  const [name, setName] = useState('')
  const [imageURL, setImageUrl] = useState('')
  const [activeDateEvent, setActiveDateEvent] = useState(null)
  const [activeDate, setActiveDate] = useState(null)
  const [todaysDate, setTodaysDate] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [foundDateEvent, setFoundDateEvent] = useState(false)
  const [timerCount, setTimer] = useState(7200) // 2 hours
  const { width, height } = Dimensions.get('window')
  const [securityCode, setSecurityCode] = useState(12345)
  const [codeInput, setCodeInput] = useState(56789)

  const [currentFriend, setCurrentFriend] = useState("");
  const [currentFriendDate, setCurrentFriendDate] = useState("");
  const [codeSubmit, setCodeSubmit] = useState(false); 
  const [currentFriendName, setCurrentFriendName] = useState("")


  const [userLocation, setUserLocation] = useState({}); 
  const [validCode, setValidCode] = useState(false);
  var [testValue, setTestValue] = useState(""); 
  const [mapRef, setMapRef] = useState(null);

  const testData = {
    age: 30,
    dob: 'Thu Mar 21 1991',
    location: {
      comment: 'Barsecco',
      id: 9,
      lat: 25.7601275,
      location: '1421 S Miami Ave Miami, FL 33130',
      long: -80.1932658
    },
    myLinks: [
      {
        name: 'Hank M. Zakroff',
        phoneNumber: '7075551854',
        uid: '2E73EE73-C03F-4D5F-B1E8-44E85A70F170'
      },
      {
        name: 'David Taylor',
        phoneNumber: '5556106679',
        uid: 'E94CD15C-7964-4A9B-8AC4-10D7CFB791FD'
      },
      {
        name: 'Kate Bell',
        phoneNumber: '4155553695',
        uid: '177C371E-701D-42F8-A03B-C61CA31627F6'
      }
    ],
    name: 'Sierra Mist',
    otherMeeting: 'Other option was not selected.',
    phoneNumber: '(123) 456-7890',
    dateImg:
      'https://firebasestorage.googleapis.com/v0/b/fidoocia-e9f07.appspot.com/o/user-images%2Fp5ZQciYxuRMLLE3dkwy3c4NJ0R52?alt=media&token=cd534d01-edb0-4118-93bb-b69c05d99b3b',
    scheduledDate: '2021-07-15',
    selected: 'Bumble',
    startTime: '11:00AM',
    verificationImages: {
      '-Mec8tF-Sl-6ksT_Y-cp':
        'https://firebasestorage.googleapis.com/v0/b/fidoocia-e9f07.appspot.com/o/user-images%2Fp5ZQciYxuRMLLE3dkwy3c4NJ0R52?alt=media&token=145de9da-bef0-46f6-864a-a804f2fc2e86',
      '-Mec8tdCdEya6446PYrS':
        'https://firebasestorage.googleapis.com/v0/b/fidoocia-e9f07.appspot.com/o/user-images%2Fp5ZQciYxuRMLLE3dkwy3c4NJ0R52?alt=media&token=d78c08be-d282-42a0-8dd0-af6dabf2ca01',
      '-Mec8u3zKG63TbzjmRj2':
        'https://firebasestorage.googleapis.com/v0/b/fidoocia-e9f07.appspot.com/o/user-images%2Fp5ZQciYxuRMLLE3dkwy3c4NJ0R52?alt=media&token=7973bc2d-a04d-4686-b6f3-941970536a26'
    }
  }

  

  useEffect(() => {
    if(false){
      fire
      .ref('users')
      .child(`${currentFriend}/dates/${currentFriendDate}`)
      .on('value', ss => {
        setActiveDate({
          dateName: ss.val().name,
          dateImage: ss.val().dateImg,
          dateLocation: ss.val().location.comment,
          age: ss.val().age,
          phoneNumber: ss.val().phoneNumber
        })
      })
    }
    else{
      console.log('No friend tracked right now')
    }
    
  }, [])

  const getTodaysDate = () => {}

  const generateSecurityCode = () => {
    setSecurityCode(Math.floor(Math.random() * 90000) + 10000)
    console.log(codeInput)
    console.log('CODE', secruityCode)
  }

  const handleCodeInput = value => {
    setCodeInput(value)
  }

  const checkOut = () => {
    console.log(codeInput, sc)
    if (codeInput == sc) {
      alert('Checked Out')
    } else {
      alert('Incorrect security code')
    }
  }

  let timer = () => {}
  const [timeLeft, setTimeLeft] = useState(7200)

  const startTimer = () => {
    timer = setTimeout(() => {
      if (timeLeft <= 0) {
        clearTimeout(timer)
        return false
      }
      setTimeLeft(timeLeft - 1)
    }, 1000)
  }

  useEffect(() => {
    startTimer()
    return () => clearTimeout(timer)
  })

  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10) // don't forget the second param
    var hours = Math.floor(sec_num / 3600)
    var minutes = Math.floor((sec_num - hours * 3600) / 60)
    var seconds = sec_num - hours * 3600 - minutes * 60

    if (hours < 10) {
      hours = '0' + hours
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (seconds < 10) {
      seconds = '0' + seconds
    }
    return hours + ':' + minutes + ':' + seconds
  }

  const timeFromNow = x => {
    let current = {
      hour: new Date().getHours(),
      minutes: new Date().getMinutes()
    }
    let date = {
      hour: x.startTime.includes('PM')
        ? Number(x.startTime.split(':')[0] + 12)
        : Number(x.startTime.split(':')[0]),
      minutes: Number(x.startTime.split(':')[1].substring(0, 2))
    }
    return (date.hour - current.hour) * 60 + (date.minutes - current.minutes)
  }
  // findActiveDate()



  const handleCodeSubmission = () => {
    console.log(currentFriend, currentFriendDate)
    if(currentFriend == "" || currentFriendDate == ""){
      alert("Please ensure that you have submitted the right codes and try again.");
    }
    else{
      fire.ref(`${currentFriend}/dates/${currentFriendDate}/activeLocation`).once("value", snapshot => {
        if (true){
           console.log("exists!");
           fire
           .ref("users")
           .child(`${currentFriend}/dates/${currentFriendDate}`)
           .on("value", (ss) => {
               setActiveDate({ dateName: ss.val().name, 
                               dateLastName: ss.val().lastName,
                               dateImage: ss.val().dateImg, 
                               dateLocation: ss.val().location, 
                               age: ss.val().age, 
                               phoneNumber: ss.val().phoneNumber});
             }
           )
       
       
           fire
           .ref("users")
           .child(`${currentFriend}/personal/`)
           .once("value", (ss) => {
               setCurrentFriendName(`${ss.val().name} ${ss.val().lastName} `)
           })
        }
        else{
          alert("This date is not yet active.")
        }
     });

    
    }

    
  }

  const switchUser = () => {
    setValidCode(false)
  }

  const selectLocation = ({ lat, long }) => {
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: lat,
        longitude: long,
        latitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.00522,
        longitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.00522
      })
    }
  }

  return (
    <View style={{ flex: 1,  backgroundColor: "white"}}>
      {activeDate != null ? (
        <View style={styles.container}>
          
          <MapView style={styles.map}>
            <Marker
              key={0}
              coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.00522,
                longitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.00522
              }}
              onPress={e => {
                if (e.nativeEvent.action === 'marker-press') {
                  selectLocation({
                    latitude: 37.78825,
                    longitude: -122.4324
                  })
                } else {
                  console.log('')
                }
              }}
              title={`${activeDate.dateName} ${activeDate.dateLastName}`}
              description={"Your friend's location."}
            />
          </MapView>
          <SafeAreaView>
          <Image
            source={{
              uri: activeDate.dateImage
                ? activeDate.dateImage
                : 'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg'
            }}
            style={{
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 15,
              width: width / 3.5,
              height: width / 3.5,
              borderRadius: width / 4
            }}
          />
          <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: "center", }}>
            {activeDate.dateName} {activeDate.dateLastName}, {activeDate.age}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`tel:${activeDate.phoneNumber}`)
            }}
          >
            <View style={{ flexDirection: 'row', marginVertical: 8, alignSelf: "center", }}>
              <Ionicons name='call' size={22} style={{ marginRight: 5 }} />
              <Text style={{ fontSize: 18, marginBottom: 15, marginRight: 10 }}>
                {activeDate.phoneNumber}
              </Text>
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 15, marginLeft: 15, marginRight: 15, marginBottom: 10, textAlign: 'center' }}>
            {currentFriendName} is currently on a date with {activeDate.dateName} {activeDate.dateLastName} at {activeDate.dateLocation.name}.{' '}
          </Text>
          <Text style={{ fontSize: 15, marginTop: 1, marginBottom: 10, textAlign: 'center' }}>
             {activeDate.dateLocation.location}
          </Text>
          <Button label='Switch User' width={350} onPress={switchUser} />
          </SafeAreaView>
        </View>
      ) : (
        <SafeAreaView style={styles.linkContainer}>
           <Ionicons
          onPress={() => navigation.goBack()}
          name='chevron-back-outline'
          size={width/12}
          style={{ alignSelf: 'flex-start' }}
        />
          <Text style={styles.title}>Find a Friend</Text>
          <Image style={{width: width * 0.7, height: width * 0.7}} source={require('../images/faf.png')}/>
          <Text style={styles.paragraph}>
            Please enter the two unique codes sent to your personal number to access your friend's
            location and date information during their scheduled date.
          </Text>
          <Input
            label='First Code'
            leftIcon={{ type: 'material', name: 'lock' }}
            value={currentFriend}
            onChangeText={text => setCurrentFriend(text)}
            style={styles.input}
          />
          <Input
            label='Second Code'
            leftIcon={{ type: 'material', name: 'lock' }}
            value={currentFriendDate}
            onChangeText={text => setCurrentFriendDate(text)}
            style={styles.input}
          />
          <Button buttonWidth={width * 0.8} label='Submit'  onPress={handleCodeSubmission} />
        </SafeAreaView>
      )}
    </View>
  )
}
const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  button: {
    width: 200,
    marginTop: 10
  },
  input: {
    marginRight: 0
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  cardContainer: {
    borderColor: 'slategray',
    borderWidth: StyleSheet.hairlineWidth,
    lineHeight: width / 22,
    fontSize: width / 28,
    backgroundColor: 'white',
    color: 'black',
    paddingVertical: width / 25,
    paddingLeft: width / 50,
    width: 275,
    borderRadius: width / 75,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  linkContainer: {
    flex: 1,
    alignItems: 'center',
    marginLeft: width/35
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2
  },
  title: {
    fontSize: width/10,
    fontWeight: 'bold',
    marginTop: height/100,
  },
  paragraph: {
    marginLeft: width/40,
    marginBottom: height/50,
    width: '90%',
    alignSelf: 'flex-start'
  }
})

export default FriendScreen 