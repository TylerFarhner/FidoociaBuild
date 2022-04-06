import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { ActivityIndicator, View, StatusBar } from "react-native";
import { Link, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Constants } from "react-native-unimodules";

import * as Screens from "./screens";
import { fire, auth, db } from "./backend/firebase.js";
import { toHHMMSS, timeFromNow } from "./utils/helpers";
// import * as Notifier from './utils/notifer.js';
import * as Verifier from "./utils/verifier";

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(null);
  const [currentUser, setUser] = useState(null);
  const [activeDate, setActiveDate] = useState(null);
  const [dates, setDates] = useState(null);
  const [verifications, setVerifications] = useState(null);
  const [location, setLocation] = useState(null);
  const state = { currentUser, location, verifications, dates, activeDate };
  const setters = { setActiveDate };
  const Tab = createBottomTabNavigator();
  const [Home, Map, Login, Root] = [0, 0, 0, 0].fill(createStackNavigator());
  const Stack = ({ component, screens, initialRouteName }) => {
    return (
      <component.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ gestureEnabled: false }}
      >
        {Array.from(screens).map((screen, index) => (
          <component.Screen
            key={index}
            name={screen.name}
            options={{ headerShown: false }}
          >
            {(props) => (
              <screen.component
                {...props}
                {...screen.props}
                {...state}
                {...setters}
              />
            )}
          </component.Screen>
        ))}
      </component.Navigator>
    );
  };
  const HomeScreens = [
    { name: "Home", component: Screens.HomeScreen },
    { name: "Date", component: Screens.DateProfileScreen },
    { name: "Submission", component: Screens.SubmissionScreen },
    { name: "Gallery", component: Screens.ImageGallery },
    { name: "Status", component: Screens.StatusScreen },
    { name: "Settings", component: Screens.SettingsScreen },
    { name: "Edit", component: Screens.EditScreen },
    { name: "Location", component: Screens.LocationSelectionScreen },
    { name: "Contacts", component: Screens.PhoneBook },
    { name: "Haven", component: Screens.HavenSelectionScreen },
    { name: "CheckOutScreen", component: Screens.CheckOutScreen },
  ];
  const MapScreens = [
    { name: "Locations", component: Screens.LocationsScreen },
    { name: "Friend", component: Screens.FriendScreen },
  ];
  const AuthScreens = [
    { name: "Login", component: Screens.LoginScreen },
    { name: "Register", component: Screens.RegisterScreen },
    { name: "ResetPassword", component: Screens.ResetPasswordScreen },
  ];
  const HomeStack = () =>
    Stack({ component: Home, screens: HomeScreens, initialRouteName: "Home" });
  const MapStack = () =>
    Stack({
      component: Map,
      screens: MapScreens,
      initialRouteName: "Locations",
    });
  const Tabs = [
    { name: "Home", component: HomeStack, icon: "calendar-outline" },
    //{ name: 'Check-Out', component: Screens.CheckOutScreen, icon: 'alarm-outline'},
    { name: "Locations", component: MapStack, icon: "earth-outline" },
    {
      name: "Notifications",
      component: Screens.NotificationsScreen,
      icon: "md-megaphone",
      iconFocused: "md-megaphone-outline",
    },
    { name: "Map", icon: "earth" },
  ];

  const track = async () => {
    if (activeDate) {
      let now = await Location.getCurrentPositionAsync({});
      let { latitude, longitude } = now.coords;
      //fire.ref(`users/${auth.currentUser.uid}/dates/${activeDate.key}/userLocation`).update({ latitude, longitude })
      setLocation({ ...location, latitude, longitude });
    }
  };

  useLayoutEffect(() => {
    async function authorizeLocation() {
      let { status: permissions } =
        await Location.requestForegroundPermissionsAsync();
      setLocation({ ...location, permissions });
      if (permissions !== "granted") {
        setLocation({
          ...location,
          permissions,
          error: "Permission to access location was denied",
        });
      }
    }
    auth.onAuthStateChanged((user) => {
      setLoggedIn(Object.keys(user || {}).length > 0);
      authorizeLocation();
    });
  }, []);

  useLayoutEffect(() => {
    if (isLoggedIn && auth.currentUser) {
      console.log("VERIFICATIONS I");
      let currentUser = auth.currentUser.uid;
      Verifier.retrieveVerifications(currentUser, (x) => setVerifications(x));
      setUser(currentUser);
      console.log("logged in:", currentUser);
      // Notifier.setup({id: currentUser});
    } else {
      console.log("logged in:", false);
    }
  }, [auth.currentUser]);

  //  useLayoutEffect(() => {
  //    console.log('VERIFICATIONS II')
  //    if (verifications) {
  //      fire.ref(`users/${currentUser}/dates/`).on('value', ss => {
  //        let val = ss.val();
  //        //while (val == null) { continue; }
  //        let res = Object.keys(val)
  //          .map(key => ({ ...val[key], key }))
  //          .filter(x => x.scheduledDate)
  //          .map(x => {
  //            let {scheduledDate: d, startTime: t} = x;
  //            return { ...x, timeFromNow: timeFromNow(`${d} ${t}`, 'minutes')}
  //          })
  //        setDates(res);
  //      })
  //    }
  //  }, [verifications]);

  useLayoutEffect(() => {
    if (dates) {
      let active = dates
        .filter((x) => -(60 * 3) < x.timeFromNow && x.timeFromNow < 60 * 24)
        .sort((x, y) => x.timeFromNow - y.timeFromNow)[0];
      if (active) {
        let { key, name, dateImg: image, location, access_code } = active;
        active.image =
          image && image.length == 0
            ? "https://kansai-resilience-forum.jp/wp-content/uploads/2019/02/IAFOR-Blank-Avatar-Image-1.jpg"
            : image;
        setActiveDate(active);
      }
    }
  }, [dates]);

  useEffect(() => {
    if (activeDate && activeDate.start) {
      track();
    }
  }, [activeDate]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      {isLoggedIn === null ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : isLoggedIn ? (
        <Root.Navigator headerMode="none">
          <Root.Screen name="Root">
            {() => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  // eslint-disable-next-line react/display-name
                  tabBarIcon: ({ focused, color, size }) => {
                    let { icon, iconFocused } = Tabs.find(
                      (x) => x.name == route.name
                    );
                    return (
                      <Ionicons
                        name={focused && iconFocused ? iconFocused : icon}
                        size={size}
                        color={color}
                      />
                    );
                  },
                })}
                tabBarOptions={{
                  activeTintColor: "#198cff",
                  inactiveTintColor: "gray",
                  showLabel: true,
                }}
              >
                {Tabs.map(
                  (screen, index) =>
                    screen.component && (
                      <Tab.Screen
                        key={index}
                        name={screen.name}
                        options={{ headerShown: false }}
                      >
                        {(props) => (
                          <screen.component
                            {...props}
                            {...state}
                            {...setters}
                          />
                        )}
                      </Tab.Screen>
                    )
                )}
              </Tab.Navigator>
            )}
          </Root.Screen>
          <Root.Screen name="PhoneAuth" component={Screens.PhoneAuthScreen} />
        </Root.Navigator>
      ) : (
        <Login.Navigator
          screenOptions={{
            headerBackTitleVisible: false,
            headerTintColor: "#333",
            headerTitleStyle: { color: "transparent" },
            headerStyle: {
              shadowColor: "transparent",
              backgroundColor: "#EEE",
            },
          }}
        >
          {AuthScreens.map(
            (screen, index) =>
              screen.component && (
                <Login.Screen name={screen.name} component={screen.component} />
              )
          )}
        </Login.Navigator>
      )}
    </NavigationContainer>
  );
}
