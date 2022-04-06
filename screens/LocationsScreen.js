import React, { useState, useEffect, useRef } from 'react'
 import {
   Text,
   Image,
   View,
   Dimensions,
   StyleSheet,
   FlatList,
   Platform,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
   useWindowDimensions
 } from 'react-native'
 import MapView from 'react-native-maps'
 import { auth, db, fire } from '../utils/firebase'
 import { Marker } from 'react-native-maps'
 import * as Location from 'expo-location'
 import { Constants } from 'react-native-unimodules'
 import Button from '../components/Button'
 import { Ionicons } from '@expo/vector-icons'

 function LocationsScreen({ route, navigation }) {
   const [showHavens, setShowHavens] = useState(false)
   const [mapRef, setMapRef] = useState(null)
   const [location, setLocation] = useState(null)
   const [errorMsg, setErrorMsg] = useState(null)
   const { height } = useWindowDimensions()
   const scrollRef = useRef()

   const handleLocationSubmit = safeHaven => {
     console.log('handleLocationSubmit: ', safeHaven)
     route.params.updateLocation(safeHaven)
     navigation.goBack()
   }

   const distance = (lat1, lon1, lat2, lon2) => {
     var p = 0.017453292519943295 // Math.PI / 180
     var c = Math.cos
     var a =
       0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

     return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
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
   const [safeHavenData, setSafeHavenData] = useState([
     {
       id: 1,
       lat: 38.9169677,
       long: -77.0230672,
       location: '801 Florida Ave NW Washington, DC  20001 United States',
       name: '801 Bar'
     },
     {
       id: 100,
       lat: 39.6837,
       long: -75.7497,
       location: 'Newark, DE, United States',
       name: 'Newark, DE'
     },
     {
       id: 2,
       lat: 38.8712523,
       long: -77.0064144,
       location: '79 Potomac Avenue SE, Washington, DC 20003',
       name: 'All Purpose Riverfront'
     },
     {
       id: 3,
       lat: 38.9064667,
       long: -77.0249856,
       location: '124 Blagden Alley NW Washington, DC 20001',
       name: 'Columbia Room'
     },
     {
       id: 4,
       lat: 38.94204330444336,
       long: -77.01941680908203,
       location: '201 Upshur St NW Washington, DC 20011',
       name: 'Slash Run'
     },
     {
       id: 5,
       lat: 38.9140774,
       long: -77.0711315,
       location: '1226 36th St NW Washington, DC 20007',
       name: 'The Tombs'
     },
     {
       id: 6,
       lat: 38.9172914,
       long: -77.0414228,
       location: '2003 18th St NW Washington, DC 20009',
       name: 'Blagaurd'
     },
     {
       id: 7,
       lat: 38.9173843,
       long: -77.0413138,
       location: '2007 18th St NW Washington, DC 20009',
       name: 'Jack Rose Dining Saloon'
     },
     {
       id: 8,
       lat: 38.921504974365234,
       long: -77.04228210449219,
       location: '2446 18th St NW Washington, DC 20009',
       name: 'Roofers Union'
     },
     {
       id: 9,
       lat: 25.7601275,
       long: -80.1932658,
       location: '1421 S Miami Ave Miami, FL 33130',
       name: 'Barsecco'
     }
   ])

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

   var mapMarkers = () => {
     return safeHavenData.map(safeHaven => (
       <Marker
         key={safeHaven.id}
         pinColor='#007aff'
         coordinate={{
           latitude: Number(safeHaven.lat),
           longitude: Number(safeHaven.long)
         }}
         onPress={e => {
           if (e.nativeEvent.action === 'marker-press') {
             selectLocation(safeHaven)
           } else {
             console.log('')
           }
         }}
         title={safeHaven.location}
         description={safeHaven.name}
       />
     ))
   }

   const displayHavens = () => {
     setShowHavens(old => !old)
     setTimeout(() => scrollRef.current.scrollTo({ x: 0, y: height / 2, animated: true }), 100)
   }

   const Item = ({ title, location, json }) => (
     <TouchableOpacity
       onPress={() => {
         selectLocation(json)
       }}
       style={{ flex: 1 }}
     >
       <View style={styles.item}>
         <View style={{ flexDirection: 'column' }}>
           <Text style={styles.title}>{title}</Text>
           <Text style={styles.subtitle}>{location}</Text>
         </View>
         <View style={{ flex: 1, alignItems: 'flex-end' }}>
           <Ionicons name='navigate' size={20} color='#007aff' />
         </View>
       </View>
     </TouchableOpacity>
   )

   const renderItem = ({ item }) => <Item title={item.name} location={item.location} json={item} />

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
       setLocation(location)
       let { coords } = location

       safeHavenData.sort((a, b) => {
         let x = distance(coords.latitude, coords.longitude, a.lat, a.long)
         let y = distance(coords.latitude, coords.longitude, b.lat, b.long)
         return x - y
       })
     })
   }, [])

   return (
     <ScrollView
       ref={scrollRef}
       style={{
         flex: 1,
         backgroundColor: 'white'
       }}
     >
       {location ? (
         <MapView
           style={styles.map}
           ref={ref => {
             setMapRef(ref)
           }}
           showsUserLocation
           initialRegion={{
             latitude: location.coords.latitude,
             longitude: location.coords.longitude,
             latitudeDelta: 0.005,
             longitudeDelta: 0.005
           }}
         >
           {mapMarkers()}
          {/* <SafeAreaView
         style={{
             position: 'absolute',//use absolute position to show button on top of the map
             left: 10,
             alignSelf: 'space-around' 
         }}
     >
          <TouchableOpacity style={{flexDirection: 'row', backgroundColor: "white", borderRadius: width / 4.5 }} onPress={() => navigation.goBack()}>
           <Ionicons name="chevron-back-outline" size={width / 10} /> 
         </TouchableOpacity>
       </SafeAreaView> */}
         </MapView>
       ) : (
         <MapView style={styles.map} />
       )}
       <View
         style={{
           width: '100%',
           paddingTop: height/15,
           borderTopColor: 'lightgray',
           borderTopWidth: 1,
           alignItems: 'center',
         }}
       >
          <Button
           onPress={() => {
             navigation.navigate('Friend')
           }}
           label='Find a Friend'
           buttonWidth={width * 0.8}
         />
         {/*
           <Button
           onPress={() => {
             signOut(); 
           }}
           label='Sign Out'
           width={350}
         />
         */}
         <Button
           onPress={displayHavens}
           label={showHavens ? 'Hide Safe Havens' : 'Show Safe Havens'}
           buttonWidth={width * 0.8}
         />

         {showHavens && (
           <View style={styles.flatlistContainer}>
           <FlatList
             showsVerticalScrollIndicator={true}
             scrollEnabled={true}
             data={safeHavenData}
             renderItem={renderItem}
             keyExtractor={item => item.id.toString()}
           />
           </View>
         )}
       </View>
     </ScrollView>
   )
 }

 const { height, width } = Dimensions.get('window');
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center'
   },
   flatlistContainer: {
     fontFamily: 'Circula-Medium',
     height: height / 4,
     marginBottom: 15
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

   searchContainer: {
     backgroundColor: 'slategray',
     width: Dimensions.get('window').width / 1.5,
     height: Dimensions.get('window').height / 20
   },
   map: {
     width: Dimensions.get('window').width,
     height: Dimensions.get('window').height / 1.6
   },
   item: {
     flex: 1,
     flexDirection: 'row',
     alignItems: 'center',
     borderColor: '#CCC',
     borderWidth: 1,
     borderRadius: 5,
     lineHeight: width / 22,
     fontSize: width / 28,
     padding: 14,
     marginVertical: 4,
     marginHorizontal: 15
   },
   title: {
     fontSize: 14,
     fontWeight: '500'
   },
   subtitle: {
     fontSize: 12
   }
 })

 export default LocationsScreen