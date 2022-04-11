import React, { useState, useEffect } from 'react'
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native'
import { Agenda } from 'react-native-calendars'
import { auth, fire, db } from '../utils/firebase'
import { Card, Avatar, FAB } from 'react-native-paper'
import TextAvatar from 'react-native-text-avatar'
import DateTimePicker from '@react-native-community/datetimepicker'
import Button from '../components/Button'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

/* Will return today's date in YYYY-MM-DD format */
const getToday = () => {
  const today = new Date()
  const date = today.toLocaleDateString()
  return date
}

const todayDate = getToday()

function HomeScreen({ navigation }) {
  // Check-In Screen

  var today = new Date()

  const [startTime, setStartTime] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState({ dateString: todayDate })
  const [calendarOpened, setCalendarOpened] = useState(false)

  const [defaultContacts, setDefaultContacts] = useState([
    { name: 'Sheila R.', phoneNumber: '302-566-7888' },
    { name: 'Stan S.', phoneNumber: '302-456-3245' },
    { name: 'Leo A.', phoneNumber: '302-111-3689' },
  ])

  const [defaultLocation, setDefaultLocation] = useState('AMC')
  const [sortData, setSortData] = useState()

  const [mode, setMode] = useState('date')
  const [show, setShow] = useState(false)
  const [items, setItems] = useState({})

  const reformatTime = (timeString) => {
    let formatted = ''
    if (timeString.length == 6) {
      formatted =
        timeString.substring(0, 4) +
        ' ' +
        timeString.substring(4, timeString.length)
      return formatted
    } else {
      formatted =
        timeString.substring(0, 5) +
        ' ' +
        timeString.substring(5, timeString.length)
      return formatted
    }
  }

  const sortByTime = (json) => {
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
    console.log('HomeScreen: TODAY IS', todayDate, selectedDay.dateString)

    db.collection('users')
      .doc(auth.currentUser.uid)
      .collection('dates')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let items = {}
          const events = doc.data()

          Object.keys(events).map((key) => {
            const {
              scheduledDate,
              name,
              lastName,
              startTime,
              phoneNumber,
              age,
              dateImg,
              isDateValid,
              location,
              contacts,
            } = events[key]

            const dateObject = {
              name: `Date with ${name}`,
              lastName: lastName,
              prospect: name,
              startTime: startTime ? startTime : '6:00PM',
              age: age,
              phoneNumber: phoneNumber,
              profileUri: dateImg,
              isDateValid: isDateValid ? true : false,
              location: location || defaultLocation,
              contacts: contacts || [
                { name: 'Sheila R.', phoneNumber: '302-566-7888' },
                { name: 'Stan S.', phoneNumber: '302-456-3245' },
                { name: 'Leo A.', phoneNumber: '302-111-3689' },
              ],
              scheduledDate: scheduledDate,
              ref: key,
            }

            items = {
              ...items,
              [scheduledDate]: items[scheduledDate]
                ? items[scheduledDate].concat(dateObject)
                : [dateObject],
            }
          })
          sortByTime(items)
          setItems(items)
        })
      })
      .catch((error) => {
        console.log('Error getting documents: ', error)
      })
  }, [])

  const renderItem = (item) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Date', {
              itemId: 86,
              name: item.name,
              lastName: item.lastName,
              age: item.age,
              startTime: item.startTime,
              location: item.location,
              dateImg: item.profileUri,
              contacts: item.contacts,
              isDateValid: item.isDateValid,
              date: item.scheduledDate,
              phoneNumber: item.phoneNumber,
              ref: item.ref,
            })
          }
          style={{ marginRight: width / 40, marginTop: height / 50 }}
        >
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'left',
                  }}
                >
                  <Text style={{ marginBottom: height / 100 }}>
                    {item.startTime}
                  </Text>
                  <Text
                    style={{ fontSize: width / 23, marginBottom: height / 250 }}
                  >
                    {item.name} {item.lastName}
                  </Text>
                  <Text style={{ color: '#8e9fae' }}>{item.location.name}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('CheckOutScreen', {
                        itemId: 86,
                        name: item.prospect,
                        lastName: item.lastName,
                        age: item.age,
                        startTime: item.startTime,
                        location: item.location,
                        dateImg: item.profileUri,
                        contacts: item.contacts,
                        isDateValid: item.isDateValid,
                        date: item.scheduledDate,
                        phoneNumber: item.phoneNumber,
                        ref: item.ref,
                      })
                    }
                    style={{
                      backgroundColor: 'green',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: height / 75,
                      paddingHorizontal: width / 30,
                      paddingVertical: height / 100,
                      borderRadius: width / 2,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={'message-text-clock'}
                      size={width / 25}
                      color={'white'}
                    />
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        marginLeft: width / 50,
                        fontSize: width / 35,
                      }}
                    >
                      {'SHARE DATE'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextAvatar
                  backgroundColor={'#198cff'}
                  textColor={'white'}
                  size={70}
                  type={'circle'}
                >
                  {item.prospect.charAt(0)}
                </TextAvatar>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </View>
    )
  }

  const renderEmptyData = (e) => (
    <View
      style={{
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../images/violetonwhite.png')}
        style={{ width: 200, height: 200, tintColor: '#BBB' }}
      />
      <Text style={styles.title}>No events on this day</Text>
    </View>
  )

  const updateStartTime = (selectedDate) => {
    const currentDate = selectedDate || startTime
    setShow(Platform.OS === 'ios')
    setStartTime(currentDate)
  }

  const formatTime = (time) => {
    var minutes = time.getMinutes()
    minutes = minutes > 9 ? minutes : '0' + minutes

    let unformattedTime = `${time.getHours()}:${minutes}`
    let hours = parseInt(unformattedTime.substring(0, 2))
    let formattedTime = ''

    if (hours > 12) {
      hours = hours - 12
      formattedTime = `${hours}:${minutes}`
      formattedTime = formattedTime.concat('PM')
    } else if (hours == 12) {
      formattedTime = `${hours}:${minutes}`
      formattedTime = formattedTime.concat('PM')
    } else if (hours == 0) {
      formattedTime = `${12}:${minutes}`
      formattedTime = formattedTime.concat('AM')
    } else {
      formattedTime = unformattedTime
      formattedTime = formattedTime.concat('AM')
    }

    return formattedTime
  }

  return (
    <SafeAreaView
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        flex: 1,
      }}
    >
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
            <Text style={{ fontSize: 23, marginBottom: 30 }}>
              What time is your date?
            </Text>
            <DateTimePicker
              testID="dateTimePicker"
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={updateStartTime}
              style={{
                marginTop: 5,
                marginBottom: 35,
                width: 100,
                alignSelf: 'center',
              }}
            />
            <Button
              label="Continue"
              onPress={() => {
                setModalOpen(false)
                navigation.navigate('Submission', {
                  startTime: formatTime(startTime),
                  scheduledDate: selectedDay.dateString,
                })
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width,
          paddingHorizontal: width / 20,
        }}
      >
        <View style={{ width: width / 8, height: width / 8 }} />
        <Image
          source={require('../images/fidologo.png')}
          style={{ width: width / 8, height: width / 8 }}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: width / 8,
            height: width / 8,
          }}
        >
          <Ionicons
            name={'settings-outline'}
            color={'gray'}
            size={width / 15}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <Agenda
          style={{ width }}
          pastScrollRange={12}
          futureScrollRange={12}
          onDayPress={(day) => {
            setSelectedDay(day)
          }}
          selected={todayDate}
          renderItem={renderItem}
          items={items}
          hideKnob={false}
          renderEmptyData={renderEmptyData}
          onCalendarToggled={(calendarOpened) => {
            setCalendarOpened(calendarOpened)
          }}
        />
        <FAB
          style={{
            position: 'absolute',
            right: width / 20,
            bottom: height / 50,
            backgroundColor: '#198cff',
          }}
          label="new event "
          icon="plus"
          animated
          visible={selectedDay.dateString >= todayDate && !calendarOpened}
          onPress={() => setModalOpen(true)}
        />
      </View>
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
  title: {
    fontSize: 20,
    color: '#888',
    marginTop: 10,
    marginBottom: 10,
  },
  map: { width, height },
})

export default HomeScreen
