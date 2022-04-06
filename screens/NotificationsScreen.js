import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground
} from 'react-native'
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { auth, db, fire } from '../utils/firebase'
import { Avatar } from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons'
import * as Notifications from 'expo-notifications'

// const { width, height } = Dimensions.get('window');

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
})

var displayName = 'Sarah'

function NotificationsScreen({ navigation }) {
  const [messages, setMessages] = useState([])

  /*
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  */

  useEffect(() => {
    if (!auth.currentUser.phoneNumber) {
      navigation.replace('PhoneAuth')
    }
  })

  useLayoutEffect(() => {
    let username = auth.currentUser.uid
    let notificationsRef = fire.ref('users').child(username).child('notifications')
    db
      .collection(username)
      .doc('userInfo')
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        let docs = snapshot.docs.map(doc => doc.data())
        .sort((a,b) => b.createdAt.seconds - a.createdAt.seconds)
        .map((x) => ({
          ...x,
          createdAt: x.createdAt.toDate(),
          prospect: String(x.text.split("'s")[0]).toLowerCase(),
          param: String(x.text.split(" ")[1]).toLowerCase(),
        }))
        .filter((x) => x.text.length > 0 && x.text.includes("'s"));
        setMessages(docs.filter((x,i) => !docs.filter((a,b) => b < i).map((c) => c.prospect+c.param).includes(x.prospect+x.param)));
      })
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const { _id, createdAt, text, user } = messages[0]

    /* This was using firestore */
    db.collection(displayName).doc('userInfo').collection('notifications').add({
      _id,
      createdAt,
      text,
      user
    })
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <Avatar
            rounded
            source={{
              uri: 'https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
            }}
          />
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{
            marginRight: 30
          }}
          onPress={signOut}
        >
          <AntDesign name='logout' size={24} color='black' />
        </TouchableOpacity>
      )
    })
  }, [])

  /* Method for sign off */
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        navigation.replace('Login')
      })
      .catch(error => {
        // An error happened.
      })
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        style={{ flex: 1 }}
        source={require('../images/violetonwhite.png')}
        imageStyle={{
          tintColor: '#BBB',
          resizeMode: 'center'
        }}
      >
        <GiftedChat
          messages={messages}
          showAvatarForEveryMessage={true}
          disableComposer={true}
          onSend={messages => onSend(messages)}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    color: 'white'
                  },
                  left: {
                    color: '#24204F'
                  }
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: '#E6F5F3',
                    borderWidth: 1,
                    borderColor: '#bbb',
                  },
                  right: {
                    backgroundColor: '#3A13C3'
                  }
                }}
              />
            )
          }}
          user={{
            _id: 'test123',
            name: displayName,
            avatar:
              'https://www.pixsy.com/wp-content/uploads/2021/04/ben-sweet-2LowviVHZ-E-unsplash-1.jpeg'
          }}
        />
      </ImageBackground>
    </SafeAreaView>
  )
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
/*
async function sendPushNotification(expoPushToken, newMessage) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "New Verification Update",
    body: `${newMessage}`,
    data: { someData: "goes here" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {
      status: existingStatus,
    } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
*/

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  button: {
    width: 200,
    marginTop: 10
  },
  header: {
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: width / 4,
    marginTop: 0,
    width: 200,
    backgroundColor: 'yellow',
    borderTopColor: 'slategray',
    borderTopWidth: StyleSheet.hairlineWidth
  }
})

export default NotificationsScreen
