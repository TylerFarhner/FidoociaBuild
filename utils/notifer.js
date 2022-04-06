import { Constants } from 'react-native-unimodules';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { auth, fire, db } from './firebase.js';
// export async function schedulePushNotification(dateName) {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: `Date with ${dateName}`,
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 10 },
//   });
// }
export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}

export const setup = ({id, setVerifications}) => {
  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const [notificationListener, responseListener] = [useRef(), useRef()];
  // Notifications.getAllScheduledNotificationsAsync().then((x) => console.log(x));
  if (Constants.isDevice) {
    Notifications.setNotificationHandler({ handleNotification: async () => ({shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false})});
    Notifier.registerForPushNotificationsAsync().then((token) => fire.ref(`users/${id}/pushToken`).set(token));
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => console.log(notification));
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => console.log(response));
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }
};