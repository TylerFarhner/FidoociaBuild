import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Alert,
  Platform,
  TouchableOpacity
} from 'react-native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Constants } from 'react-native-unimodules';
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Button from '../components/Button';

function LocationSelectionScreen({ route, navigation }) {

  const { editLocationFlag } = route.params; 
  const [name, setName] = useState('');
  const [showLinks, setShowLinks] = useState(false);
  const [showHavens, setShowHavens] = useState(false);
  const [mapRef, setMapRef] = useState(null);
  const [locationLabel, setLocationLabel] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [flag, setFlag] = useState(false); 
  const [links, setLinks] = useState('');
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [safeHavenData, setSafeHavenData] = useState([
    {
      id: 1,
      lat: 38.9169677,
      long: -77.0230672,
      location: '801 Florida Ave NW Washington, DC  20001 United States',
      comment: '801 Bar',
    },
    {
      id: 2,
      lat: 38.8712523,
      long: -77.0064144,
      location: '79 Potomac Avenue SE, Washington, DC 20003',
      comment: 'All Purpose Riverfront',
    },
    {
      id: 3,
      lat: 38.9064667,
      long: -77.0249856,
      location: '124 Blagden Alley NW Washington, DC 20001',
      comment: 'Columbia Room',
    },
    {
      id: 4,
      lat: 38.94204330444336,
      long: -77.01941680908203,
      location: '201 Upshur St NW Washington, DC 20011',
      comment: 'Slash Run',
    },
    {
      id: 5,
      lat: 38.9140774,
      long: -77.0711315,
      location: '1226 36th St NW Washington, DC 20007',
      comment: 'The Tombs',
    },
    {
      id: 6,
      lat: 38.9172914,
      long: -77.0414228,
      location: '2003 18th St NW Washington, DC 20009',
      comment: 'Blagaurd',
    },
    {
      id: 7,
      lat: 38.9173843,
      long: -77.0413138,
      location: '2007 18th St NW Washington, DC 20009',
      comment: 'Jack Rose Dining Saloon',
    },
    {
      id: 8,
      lat: 38.921504974365234,
      long: -77.04228210449219,
      location: '2446 18th St NW Washington, DC 20009',
      comment: 'Roofers Union',
    },
    {
      id: 9,
      lat: 25.7601275,
      long: -80.1932658,
      location: '1421 S Miami Ave Miami, FL 33130',
      comment: 'Barsecco',
    },
  ]);

  const handleLocationSubmit = (safeHaven) => {
    console.log('handleLocationSubmit: ', safeHaven);
    if(editLocationFlag){
      navigation.navigate('Edit', {loc: safeHaven});
    }
    else{
      navigation.navigate('Submission', {loc: safeHaven}); 
    }
  };

  const handleManualSubmit = () => {
    if(locationLabel == '' || address == ''){
      alert('Please fill in the location and the address of your date before submitting'); 
    }
    else {
      console.log('Submitted'); 
      handleLocationSubmit({name: locationLabel, location: address })
    }
  }

  const selectLocation = (safeHaven) => {
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: safeHaven.lat,
        longitude: safeHaven.long,
        latitudeDelta:
          (Dimensions.get('window').width / Dimensions.get('window').height) *
          0.00522,
        longitudeDelta:
          (Dimensions.get('window').width / Dimensions.get('window').height) *
          0.00522,
      });
    }
    Alert.alert(
      'Date Location',
      `Would you like to select ${safeHaven.comment} as your date location`,
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
  };

  var mapMarkers = () => {
    return safeHavenData.map((safeHaven) => (
      <Marker
        key={safeHaven.id}
        coordinate={{
          latitude: Number(safeHaven.lat),
          longitude: Number(safeHaven.long),
        }}
        onPress={(e) => {
          if (e.nativeEvent.action === 'marker-press') {
            selectLocation(safeHaven);
          } else {
            console.log('');
          }
        }}
        title={safeHaven.location}
        description={safeHaven.comment}
      />
    ));
  };


  const displayLinks = () => {
    if (showLinks) {
      setShowLinks(false);
    } else {
      setShowHavens(false);
      setShowLinks(true);
    }
  };

  const displayHavens = () => {
    if (showHavens) {
      setShowHavens(false);
    } else {
      setShowLinks(false);
      setShowHavens(true);
    }
  };

  const Item = ({ title, location }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.title}>{location}</Text>
    </View>
  );

  const renderItem = ({ item }) => <Item title={item.title} />;

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android' && !Constants.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
        );
        return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  
  let text = 'Waiting..';
  if (errorMsg || location) {
    text = errorMsg || JSON.stringify(location);
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <TouchableOpacity style={{flexDirection: 'row'}} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={width / 10} /> 
        </TouchableOpacity>
      <View style={{marginTop: height / 15, margin: 10,  alignSelf: "center"}}>
        <View style={{alignSelf: "center"}}>
          <Image source={require('../images/dateloc.gif')} />
          <Text style={styles.title}>Select a Date Location</Text>
          <Text style={{marginLeft: 15, marginBottom: 10}}>
            Please select a Safe Haven location  or type in the location and address of your date.
          </Text>
        </View>

        { flag ?
          <View>
            <Text style={{ marginLeft: 20, marginBottom: 10 }}>Location</Text>
            <TextInput
              value={locationLabel}
              placeholder="ex. AMC Theaters"
              placeholderTextColor={"slategray"}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onChangeText={(locationLabel) => setLocationLabel(locationLabel)}
              style={{
                alignSelf: "center",
                marginBottom: height / 50,
                borderColor: "slategray",
                borderWidth: StyleSheet.hairlineWidth,
                lineHeight: width / 22,
                fontSize: width / 28,
                backgroundColor: "white",
                color: "black",
                paddingVertical: width / 25,
                paddingLeft: width / 50,
                width: width - 3 * (width / 20),
                borderRadius: width / 75,
              }}
            />
            <Text style={{ marginLeft: 20, marginBottom: 10 }}>Address</Text>
            <TextInput
              value={address}
              placeholder="Your Street, Your City, Your State, Your Zip Code"
              placeholderTextColor={"slategray"}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onChangeText={(address) => setAddress(address)}
              style={{
                alignSelf: "center",
                marginBottom: 15,
                borderColor: "slategray",
                borderWidth: StyleSheet.hairlineWidth,
                lineHeight: width / 22,
                fontSize: width / 28,
                backgroundColor: "white",
                color: "black",
                paddingVertical: width / 25,
                paddingLeft: width / 50,
                width: width - 3 * (width / 20),
                borderRadius: width / 75,
              }}
            />
            <View style={{paddingLeft: width / 25}}>
              <Button label="Submit" width={width - 3 * (width / 20)}  onPress={handleManualSubmit}  />
              <Button label="Go Back" width={width - 3 * (width / 20)}  onPress={()=> {setFlag(false)}}  />
            </View>
          </View>

          : <View style={{marginTop: 10, alignItems: 'center'}}>
            <Button label="Enter a Location" width={width - 3 * (width / 20)}  onPress={()=> {setFlag(true)}}  />
            <Button label="Select a Safe Haven" width={width - 3 * (width / 20)}  onPress={()=>{navigation.navigate('Haven', {editLocationFlag: editLocationFlag})}}  />
          </View>}

      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  flatlistContainer: {
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
      height: 2,
    },
  },
  searchContainer: {
    backgroundColor: 'slategray',
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 2.25,
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
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  textInput: {
    alignSelf: "center"
  },
  button: {
    backgroundColor: '#333',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 8,
    marginBottom: 10,
  }
});

export default LocationSelectionScreen;
