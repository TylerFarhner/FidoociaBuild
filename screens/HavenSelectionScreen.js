import React, { useState, useEffect } from 'react'
 import {
   Text,
   View,
   Dimensions,
   StyleSheet,
   FlatList,
   Platform,
   TouchableOpacity,
   Alert,
 } from 'react-native'
 import MapView from 'react-native-maps'
 // import Button from "../components/Button";
 import { Marker } from 'react-native-maps'
 import * as Location from 'expo-location'
 import { Constants } from 'react-native-unimodules'
 import Button from '../components/Button'
 import { Ionicons } from '@expo/vector-icons'

 function HavenSelectionScreen({ route, navigation }) {
   const [showLinks, setShowLinks] = useState(false)
   const [showHavens, setShowHavens] = useState(false)
   const [mapRef, setMapRef] = useState(null)

   const handleLocationSubmit = safeHaven => {
     console.log('handleLocationSubmit: ', safeHaven)
     // route.params.updateLocation(safeHaven)
     if(editLocationFlag){
       navigation.navigate('Edit', {loc: safeHaven}); 
     }
     else{
       navigation.navigate('Submission', {loc: safeHaven}); 
     }
   }

   const {editLocationFlag} = route.params; 

   const distance = (lat1, lon1, lat2, lon2) => {
     var p = 0.017453292519943295 // Math.PI / 180
     var c = Math.cos
     var a =
       0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2

     return 12742 * Math.asin(Math.sqrt(a)) // 2 * R; R = 6371 km
   }


   const selectLocation = (safeHaven) => {
     mapRef.animateToRegion({
       latitude: safeHaven.lat,
       longitude: safeHaven.long,
       latitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.00522,
       longitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.00522
     })

     Alert.alert(
       'Date Location',
       `Would you like to select ${safeHaven.name} as your date location`,
       [
         {
           text: 'Cancel',
           onPress: () => console.log('Cancel Pressed'),
           style: 'cancel',
         },
         {
           text: 'Yes',
           onPress: () => {
             handleLocationSubmit(safeHaven);
           },
         },
       ]
     );


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

   var mapMarkers = () => {
     return safeHavenData.map(safeHaven => (
       <Marker
         pinColor='#007aff'
         key={safeHaven.id}
         coordinate={{
           latitude: safeHaven.lat,
           longitude: safeHaven.long
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

   const displayLinks = () => {
     if (showLinks) {
       setShowLinks(false)
     } else {
       setShowHavens(false)
       setShowLinks(true)
     }
   }

   const displayHavens = () => {
     if (showHavens) {
       setShowHavens(false)
     } else {
       setShowLinks(false)
       setShowHavens(true)
     }
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
           <Ionicons name='navigate' size={20} color='#3639ff' />
         </View>
       </View>
     </TouchableOpacity>
   )

   const renderItem = ({ item }) => <Item title={item.name} location={item.location} json={item} />
   const [location, setLocation] = useState(null)
   const [errorMsg, setErrorMsg] = useState(null)

   useEffect(() => {
     (async () => {
       if (Platform.OS === 'android' && !Constants.isDevice) {
         setErrorMsg(
           'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
         )
         return
       }
       let { status } = await Location.requestForegroundPermissionsAsync()
       if (status !== 'granted') {
         setErrorMsg('Permission to access location was denied')
         return
       }

       let location = await Location.getCurrentPositionAsync({})
       setLocation(location)
       let { coords } = location
       safeHavenData.sort((a, b) => {
         let x = distance(coords.latitude, coords.longitude, a.lat, a.long)
         let y = distance(coords.latitude, coords.longitude, b.lat, b.long)
         return x - y
       })
     })()
   }, [])



   return (
     <View
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
         </MapView>
       ) : (
         <MapView style={styles.map} />
       )}

       <View
         style={{
           width: '100%',
           paddingTop: 15,
           borderTopColor: '#000',
           borderTopWidth: 1,
           alignItems: 'center',
         }}
       >

         <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
           <Text style={{fontSize: 24, marginBottom: 10 , fontWeight: "bold"}}>Select a Safe Haven</Text>
         </View>


           <View style={styles.flatlistContainer}>
             <FlatList data={safeHavenData} renderItem={renderItem} keyExtractor={item => String(item.id)}  showsVerticalScrollIndicator={true}/>
           </View>

           {/* <Button
           onPress={() => {
             navigation.navigate('Link')
           }}
           label='Submit'
           width={350}
         /> */}
         <Button label="Go Back" width={350}  onPress={()=> {navigation.goBack()}}  />
       </View>
     </View>
   )
 }



 const { height, width } = Dimensions.get('window')
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center'
   },
   flatlistContainer: {
     height: height / 4.5,
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
     height: Dimensions.get('window').height / 1.9
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

 export default HavenSelectionScreen