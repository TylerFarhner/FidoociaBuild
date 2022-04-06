import React, { useState, useEffect, useRef } from 'react'
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
} from "react-native";
import { auth, db, fire, img } from "../utils/firebase";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";


function SubmissionScreen({ route, navigation }) {

  const [name, setName] = useState(''); // firstname 
  const [age, setAge] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [other, setOther] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [myLinks, setMyLinks] = useState([]);
  const [location, setLocation] = useState('');
  const [validFirstName, setValidFirstName] = useState(true)
  const [validLastName, setValidLastName] = useState(true)
  const [validPhone, setValidPhone] = useState(true)
  const [validMeet, setValidMeet] = useState(true)
  const [validLoc, setValidLoc] = useState(true)
  const [validLinks, setValidLinks] = useState(true)
  const [validAge, setValidAge] = useState(true)
  const [flag, setFlag] = useState(false)
  const { scheduledDate, startTime, loc } = route.params;

  /* For Dropdown */
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(null)
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([
    { label: 'Bumble', value: 'Bumble' },
    { label: 'Hinge', value: 'Hinge' },
    { label: 'CoffeeMeetsBagel', value: 'CoffeeMeetsBagel' },
    { label: 'OkCupid', value: 'OkCupid' },
    { label: 'Tinder', value: 'Tinder' },
    { label: 'Other', value: 'Other' }
  ])

  /* For DatePicker */
  const [date, setDate] = useState()
  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [startDate, setStartDate] = useState(new Date())

  useEffect(() => {
    if (!flag) {
      setFlag(true)
    }
  }, [])

  useEffect(() => {
    // when something changes
    if (name || lastName || phoneNumber) {
      console.log('FIELDS UPDATE', validFirstName, validLastName, validPhone, validMeet, validLoc, validLinks, validAge)
      handleFirestore();
    }
  }, [validFirstName, validLastName, validPhone, validMeet, validLoc, validLinks, validAge])


  const updateLinks = (data) => {
    setMyLinks(data);
  };

  const updateLocation = (data) => {
    setLocation(data);
  };

  const toDate = (dateStr) => {
    var parts = dateStr.split("-")
    return new Date(parts[2], parts[1] - 1, parts[0])
  }

  const validateFields = () => {

    setValidFirstName(true);
    setValidLastName(true);
    setValidPhone(true);
    setValidMeet(true);
    setValidLinks(true);
    setValidAge(true);

    if (name == '' || name.length < 2) {
      setValidFirstName(false)
      console.log(validFirstName)
    }
    if (lastName == '' || lastName.length < 2) {
      setValidLastName(false)
    }
    if (phoneNumber == '' || phoneNumber.length < 8) {
      setValidPhone(false)
    }
    if (value == null) {
      setValidMeet(false)
    }
    if (location == '') {
      setValidMeet(false)
    }
    if (myLinks.length <= 0) {
      setValidLinks(false)
    }
    if (age == '' || age < 18) {
      setValidAge(false)
    }
    console.log(validFirstName, validLastName, validPhone, validMeet, validLinks, validAge);
    console.log('Results', name, lastName, myLinks)
    console.log('validateFields done')
  }

  const convertStringToDate = (dateString) => {
    var formattedDate = new Date(dateString);
    var offsetFix = new Date(formattedDate.getTime() - formattedDate.getTimezoneOffset() * -60000); // This will fix the -1 offset 
    return offsetFix.toDateString();
  };

  useEffect(() => {
    if (loc == null || loc == "") {
      console.log('No location has been selected')
    }
    else {
      setLocation(loc);
      console.log('Location selected', location)
    }
  }, [loc])

  /* For PhoneNumber Input */
  // const [value2, setValue2] = useState('');
  // const [formattedValue, setFormattedValue] = useState('');
  // const [valid, setValid] = useState(false);
  // const [showMessage, setShowMessage] = useState(false);
  // const phoneInput = useRef(null);

  /*Phone Input Formatter*/

  const handlePhoneInput = phoneNumber => {
    // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber)
    // we'll set the input value using our setInputValue
    setPhoneNumber(formattedPhoneNumber)
  }

  function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, '')

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early

    if (phoneNumberLength < 4) return phoneNumber

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
  }

  const [image, setImage] = useState(null)

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then(
      ({ status }) =>
        status !== 'granted' && alert('Sorry, we need camera roll permissions to make this work!')
    )
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
      base64: true
    })

    if (!result.cancelled) {
      setImage(result)
    }
  }

  const getAge = dateString => {
    var today = new Date()
    var birthDate = new Date(dateString)
    var age = today.getFullYear() - birthDate.getFullYear()
    var m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleFirestore = () => {
    validateFields();
    console.log('AFTER VALIDATE ', validFirstName, validLastName, validPhone, validMeet, validLoc, validLinks, validAge);

    if (flag) {
      if (image == null) {
        alert('Please select a profile image for your date.')
      } else if (!validFirstName || !validLastName || !validPhone || !validMeet || !validLinks || !validAge) {
        alert('Please make sure all the fields are filled out properly.')
      }
      else {
        console.log('ELSE')
        fetch(`data:image/jpeg;base64,${image.base64}`).then(res =>
          res.blob().then(blob => {
            // convert it to a blob
            console.log('FETCH')
            const directoryRef = img.child(auth.currentUser.uid) // create a ref in Firebase storage with the current user's id
            // upload the image blob
            const fileRef = directoryRef.child((Math.random() * 10).toFixed(15))
            fileRef.put(blob).then(() =>
              // get the image's URL from Firebase once uploaded
              fileRef.getDownloadURL().then(url => {
                //let datesRef = db.collection('users').doc(auth.currentUser.uid);

                let newDateProfile = {
                  name,
                  lastName,
                  phoneNumber,
                  contacts: myLinks,
                  date: convertStringToDate(scheduledDate),
                  scheduledDate,
                  startTime,
                  dateImg: url,
                  age,
                  activeLocation: null,
                  platform: value,
                  location,
                  otherMeeting: other
                }

                // datesRef.get().then((doc) => {
                //   datesRef.update({
                //     dates: doc.data().dates ? doc.data().dates.concat[newDateProfile] : [newDateProfile]
                //   });
                // })

                db.collection('users')
                  .doc(auth.currentUser.uid)
                  .collection('dates')
                  .doc(`${newDateProfile.name} ${newDateProfile.lastName}`)
                  .set({
                    dateProfile: newDateProfile
                  });

                db.collection('users')
                  .doc(auth.currentUser.uid)
                  .collection('verification')
                  .doc(`${newDateProfile.name} ${newDateProfile.lastName}`)
                  .set({
                    verified: false
                  });
                navigation.navigate('Gallery', { dateKey: convertStringToDate(scheduledDate) })
              })
            )
          })
        )
      }
    }
    else {
      console.log('First time visiting this screen.')
    }
  }

  const saveInfo = () => {
    console.log('SAVE')
    // new Promise (())
    // fetch the base64 image data
    handleFirestore();
    console.log('END OF SAVE', validFirstName, validLastName, validPhone, validMeet, validLoc, validLinks, validAge);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
      }}
    >
      <SafeAreaView style={{ alignSelf: 'flex-start' }}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name='chevron-back-outline'
          size={width / 12}
          style={{ paddingLeft: 12 }}
        />
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 24, textAlign: 'center' }}>New event on</Text>
        <Text style={styles.textContainer}>
          <Text>{convertStringToDate(scheduledDate)}</Text>{' '}
          <Text style={{ color: '#666', fontWeight: '400', fontSize: 20 }}>at</Text>{' '}
          <Text>{startTime}</Text>
        </Text>
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              marginTop: 25,
              flex: 1,
              alignSelf: 'center',
              justifyContent: 'center'
            }}
          >
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: width / 2.5,
                  height: width / 2.5,
                  borderRadius: width / 4
                }}
              />
            ) : (
              <Image
                source={{
                  uri: 'https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg'
                }}
                style={{
                  width: width / 2.5,
                  height: width / 2.5,
                  borderRadius: width / 4
                }}
              />
            )}
          </View>
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: width / 3.5,
            marginBottom: height / 50
          }}
        ></Text>
        <Text style={{ marginBottom: 10 }}>First Name</Text>
        <TextInput
          value={name}
          placeholder='John'
          placeholderTextColor={'slategray'}
          autoCapitalize='words'
          autoCorrect={false}
          returnKeyType='next'
          onChangeText={name => setName(name)}
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
            borderRadius: width / 75
          }}
        />
        {validFirstName ? null : <Text style={styles.errorMsg}>Please enter a first name.</Text>}
        <Text style={{ marginBottom: 10 }}>Last Name</Text>
        <TextInput
          value={lastName}
          placeholder='Doe'
          placeholderTextColor={'slategray'}
          autoCapitalize='words'
          autoCorrect={false}
          returnKeyType='next'
          onChangeText={lastName => setLastName(lastName)}
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
            borderRadius: width / 75
          }}
        />
        {validLastName ? null : <Text style={styles.errorMsg}>Please enter a last name.</Text>}
        <Text style={styles.formLabel}>Age</Text>
        <TextInput
          placeholder='18'
          placeholderTextColor={'slategray'}
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
            borderRadius: width / 75
          }}
          keyboardType='phone-pad'
          onChangeText={(text) => setAge(text)}
          value={age}
        />
        {validAge ? null : <Text style={styles.errorMsg}>Please enter a valid age.</Text>}
        <Text style={styles.formLabel}>Phone Number</Text>
        <TextInput
          value={phoneNumber}
          maxLength={14}
          placeholder='(123) 123 4567'
          placeholderTextColor={'slategray'}
          autoCapitalize='words'
          keyboardType='phone-pad'
          autoCompleteType='tel'
          autoCorrect={false}
          returnKeyType='next'
          onChangeText={phoneNumber => handlePhoneInput(phoneNumber)}
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
            borderRadius: width / 75
          }}
        />
        {validPhone ? null : <Text style={styles.errorMsg}>Please enter a valid phone number.</Text>}
        <Text style={styles.formLabel}>How did you meet?</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          searchable={false}
          setValue={setValue}
          setItems={setItems}
          setOpen={setOpen}
          loading={loading}
          dropDownDirection='BOTTOM'
          style={{
            flexGrow: 1,
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
            borderRadius: width / 75
          }}
        />
        {validMeet ? null : <Text style={styles.errorMsg}>Please select an option.</Text>}
        {value == 'Other' ? (
          <View>
            <Text style={{ marginBottom: 10 }}>Please tell us where you met</Text>
            <TextInput
              value={other}
              placeholder='ex. Instagram'
              placeholderTextColor={'slategray'}
              autoCapitalize='words'
              autoCorrect={false}
              returnKeyType='next'
              onChangeText={other => setOther(other)}
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
                borderRadius: width / 75
              }}
            />
          </View>
        ) : (
          <View></View>
        )}
        <Text style={styles.formLabel}>Date Location</Text>
        {Object.keys(location).length === 0 ? (
          <TextInput
            value={''}
            placeholder='Select location'
            placeholderTextColor={'slategray'}
            autoCapitalize='words'
            autoCorrect={false}
            returnKeyType='next'
            onChangeText={name => setName(name)}
            onFocus={() => navigation.navigate('Location', { updateLocation })}
            style={styles.formInput}
          />
        ) : (
          <TextInput
            value={''}
            placeholder={`${location.name}`}
            placeholderTextColor={'black'}
            autoCapitalize='words'
            autoCorrect={false}
            returnKeyType='next'
            onChangeText={name => setName(name)}
            onFocus={() => navigation.navigate('Location', { updateLocation })}
            style={styles.formInput}
          />
        )}
        <Text style={styles.formLabel}>Emergency Contacts</Text>
        {myLinks.length == 0 ? (
          <TextInput
            value={''}
            placeholder={'Select your emergency contacts'}
            placeholderTextColor={'slategray'}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onFocus={() => navigation.navigate('Contacts', { updateLinks })}
            style={styles.formInput}
          />
        ) : (
          <TextInput
            value={''}
            placeholder={`${myLinks.map((link) => link.name)}`}
            placeholderTextColor={'black'}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onFocus={() => navigation.navigate('Contacts', { updateLinks })}
            style={styles.formInput}
          />
        )}
        {validLinks ? null : <Text style={styles.errorMsg}>Please select your links.</Text>}
        <Button onPress={saveInfo} label='Submit' />
      </ScrollView>
    </View>
  )
}

const { width, height } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMsg: {
    color: "red",
    marginTop: -10,
    marginBottom: 15
  },
  textContainer: {
    fontSize: 19,
    alignSelf: 'center',
    width: 300,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#006ee6',
    backgroundColor: '#EEE',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    letterSpacing: 0.65,
    overflow: 'hidden'
  },
  formInput: {
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
    borderRadius: width / 75
  },
  formLabel: {
    marginBottom: 10
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})

export default SubmissionScreen
