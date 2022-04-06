import React, { useState, useEffect } from 'react'
 import {
   StyleSheet,
   View,
   FlatList,
   ActivityIndicator,
   StatusBar,
   Text,
   Alert,
   Modal,
   Dimensions,
   TouchableOpacity,
   SafeAreaView,
   Pressable
 } from 'react-native'
 import styled from 'styled-components/native'
 import * as Contacts from 'expo-contacts'
 import { useTheme } from '@react-navigation/native'
 import { SearchBar } from 'react-native-elements'
 import Button from '../components/Button'
 import { Ionicons } from '@expo/vector-icons'

 export default function PhoneBook({ route, navigation }) {

   const [modalVisible, setModalVisible] = useState(false)
   const [search, setSearch] = useState('')
   const [multipleNumbers, setMultipleNumbers] = useState([])
   // const [isSelected, setSelection] = useState(false);
   const [specialLink, setSpecialLink] = useState()
   const [selectedNumber, setSelectedNumber] = useState('')
   const [modalMessage, setModalMessage] = useState('')
   const [testArray, setTestArray] = useState([])

   const [tmpLink, setTmpLink] = useState({}); 


   const listNumbers = multipleNumbers.map((number, i) => (
     <Text
       key={i}
       onPress={() => {
         setSelectedNumber(number.digits)
         handleClick(number.digits)
       }}
       style={{fontSize: 18, color: '#198cff', marginBottom: 8 }}
     >
       {number.digits}
     </Text>
   ))

   const handleClick = pn => {
     // console.log('PASSED NUMBER', pn);
     let tempLink = {
       name: specialLink.name,
       phoneNumber: pn,
       uid: specialLink.uid
     }
     // console.log(tempLink);
     // console.log(specialLink);
     // console.log(selectedNumber);

     if(accessedFromEdit){
       for(let i = 0; i < oldContacts.length; i++){
         setLinks(links => [...links, oldContacts[i]])
       }
       setLinks(links => [...links, tempLink]) 
       setTmpLink(tempLink); 
     }
     else{
       setLinks(links => [...links, tempLink]) 
     }
     setMultipleNumbers([])
     setModalVisible(false)
   }

   const [masterDataSource, setMasterDataSource] = useState([])

   const sortByAlpha = contacts => {
     contacts.sort((a, b) => (a.name > b.name ? 1 : -1))
     return contacts
   }

   const [info, setInfo] = useState({
     isLoading: false,
     contacts: []
   })

   const { colors } = useTheme()
   const theme = useTheme()
   const { accessedFromEdit, oldContacts } = route.params;

   /*
   const submitLinks = () => {
     console.log(`users/${auth.currentUser.uid}/dates/${dateKey}/`);
     rt.ref(`users/${auth.currentUser.uid}/dates/${dateKey}/`).update({
       myLinks: links,
     });
     navigation.navigate("Home");
   };
   */

   const Container = styled.SafeAreaView`
     flex: 1;
     background-color: ${colors.background};
     flex-direction: column;
   `

   const ContactAvatar = styled.Image`
     width: 55px;
     height: 55px;
     border-radius: 50px;
   `

   const FeedItem = styled.TouchableOpacity`
     background-color: ${colors.background};
     border-radius: 2px;
     padding: 4px;
     flex-direction: row;
     border-bottom-color: ${colors.border};
     max-width: 100%;
     max-height: 100px;
     justify-content: space-between;
   `

   const [links, setLinks] = useState([])

   const selectionAlert = item =>
     Alert.alert('Emergency Contacts Selection', `Select ${item.name} as an emergency contact?`, [
       {
         text: 'No',
         onPress: () => console.log('Cancel Pressed'),
         style: 'cancel'
       },
       { text: 'Yes', onPress: () => addToLinks(item) }
     ])


   useEffect(()=>{
     if(accessedFromEdit){
       console.log('Accessed from the edit screen.')
       console.log('Old', oldContacts)
       console.log('special', specialLink)
       console.log('Current', links)
     }
     else{
       console.log('Accessed from the regular screen.')
     }
   }, [])
   const addToLinks = item => {
     // alert(JSON.stringify(item.name));
     if(accessedFromEdit){
       console.log('Link Flag', accessedFromEdit); 
       console.log('Current', links);
       if (
         oldContacts.find(contact => contact.name === item.name) &&
         oldContacts.find(contact => contact.id === item.uid)
       ) {
         alert(`${item.name} has already been added to your emergency contacts`)
         // console.log('ITEM JSON: ', multipleNumbers);
         // console.log('TEST ARRAY: ', testArray);
       }
       else if(links.length == 3){
         alert(`You have selected the maximum amount of emergency contacts`)
       }
       else {
         let newLink
         if (item.phoneNumbers.length > 1) {
           // console.log(
           //   'WARNING: This contact has multiple numbers. We will select the first one for the Beta. 2'
           // );
           setModalMessage(`Please select a phone number for ${item.name}`)
           setMultipleNumbers([...multipleNumbers, ...item.phoneNumbers])
           setModalVisible(true)
           // console.log('ITEM JSON: ', multipleNumbers);
           // item.phoneNumbers.map((number) =>
           //   console.log('MAPPING:' + number.digits)
           // );

           newLink = {
             name: item.name,
             phoneNumber: selectedNumber ? selectedNumber : 0,
             uid: item.id
           }
           setSpecialLink(newLink)
           console.log('SPECIAL LINK', newLink);
         } else {
           if(links.length == 1){
             console.log('Current Contacts 1', links)
             alert('You have added the maximum number of contacts.')
           }
           else{
             newLink = {
               name: item.name,
               phoneNumber: item.phoneNumbers[0].digits,
               uid: item.id
             }

             for(let i = 0; i < oldContacts.length; i++){
               setLinks(links => [...links, oldContacts[i]])
             }
             setLinks(links => [...links, newLink])
             setTmpLink(newLink); 
             console.log('TMP LINK')
             console.log('TMP LINK', tmpLink)
             console.log('Current Contacts 2', links)
           }
         }
       }
     }
     else {
       if (
         links.find(contact => contact.name === item.name) &&
         links.find(contact => contact.id === item.uid)
       ) {
         alert(`${item.name} has already been added to your emergency contacts`)
         // console.log('ITEM JSON: ', multipleNumbers);
         // console.log('TEST ARRAY: ', testArray);
       } else {
         let newLink
         if (item.phoneNumbers.length > 1) {
           // console.log(
           //   'WARNING: This contact has multiple numbers. We will select the first one for the Beta. 2'
           // );
           setModalMessage(`Please select a phone number for ${item.name}`)
           setMultipleNumbers([...multipleNumbers, ...item.phoneNumbers])
           setModalVisible(true)
           // console.log('ITEM JSON: ', multipleNumbers);
           // item.phoneNumbers.map((number) =>
           //   console.log('MAPPING:' + number.digits)
           // );

           newLink = {
             name: item.name,
             phoneNumber: selectedNumber ? selectedNumber : 0,
             uid: item.id
           }
           setSpecialLink(newLink)
           // setLinks((links) => [...links, newLink]);
           // console.log('RAN WITHOUT MY PERMISSION');
         } else {
           newLink = {
             name: item.name,
             phoneNumber: item.phoneNumbers[0].digits,
             uid: item.id
           }
           setLinks(links => [...links, newLink])
         }
       }
     }
   }

   const handleMultipleNumbers = item => {
     setModalVisible(true)
   }

   const modal = item => {
     return (
       <Modal
         animationType='slide'
         transparent={true}
         visible={modalVisible}
         onRequestClose={() => {
           Alert.alert('Modal has been closed.')
         }}
       >
         <View style={styles.centeredView}>
           <View style={styles.modalView}>
             <Text style={styles.modalText}>Hello World!</Text>
             {/*
             <TouchableHighlight
               style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
               onPress={() => {
                 setModalVisible(!modalVisible);
               }}>
         <Text style={styles.textStyle}>Hide Modal</Text>
             </TouchableHighlight>
             */}
           </View>
         </View>
       </Modal>
     )
   }

   const loadContacts = async () => {
     const { status } = await Contacts.requestPermissionsAsync()
     if (status === 'granted') {
       const { data } = await Contacts.getContactsAsync({
         fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails]
       })

       if (data.length > 0) {
         const contact = data[0]
         // console.log(contact);
       }
       // console.log(data);
       setMasterDataSource(data)
       setInfo({
         ...info,
         contacts: sortByAlpha(data),
         inMemoryContacts: data,
         isLoading: false
       })
     }
   }

   useEffect(() => {
     loadContacts()
     setInfo({
       ...info,
       isLoading: true
     })
     return () => {}
   }, [])

   const renderItem = ({ item }) => {
     let items = []
     if (items.phoneNumbers) {
       items = item.phoneNumbers.map((row, i) => (
         <Text key={i} style={{ color: colors.text, fontWeight: 'bold' }}>
           {row.number}
         </Text>
       ))
     }
     return (
       <FeedItem
         onPress={() => {
           selectionAlert(item)
         }}
         style={{ borderBottomWidth: StyleSheet.hairlineWidth }}
       >
         <Text
           style={{
             padding: 10,
             fontWeight: 'bold',
             fontSize: 16,
             color: colors.text
           }}
         >
           {item.name + ' '}
         </Text>
         <Text style={{ color: colors.text, fontWeight: 'bold' }}>{item.phoneNumber}</Text>
       </FeedItem>
     )
   }

   const filterContacts = text => {
     setSearch(text)

     const filteredContacts = info.inMemoryContacts.filter(contact => {
       let contactLowercase = (contact.firstName + ' ' + contact.lastName).toLowerCase()

       let searchTermLowercase = text.toLowerCase()

       return contactLowercase.indexOf(searchTermLowercase) > -1
     })
     setInfo({ ...info, contacts: filteredContacts })
   }

   const listItems = links.map((link, i) => (
     <View
       style={{
         backgroundColor: '#DDD',
         padding: 8,
         borderRadius: 7,
         marginHorizontal: 5,
         marginVertical: 4
       }}
     >
       <Text style={{ color: '#198cff', fontSize: 16 }} key={i}>
         {link.name}
       </Text>
     </View>
   ))

   const validateLinks = () =>{
     if(links.length < 3 && (accessedFromEdit != true || accessedFromEdit == null )){
       alert('Please select 3 emergency contacts');
     }
     else if(links.length == 0){
       alert('Please select an emergency contact');
     }
     else{
       console.log('LINKS', links)
       route.params.updateLinks(links)
       navigation.goBack()
     }
   }

   return (
     <SafeAreaView style={{ flex: 1 }}>
       <StatusBar />
       <View style={{ flex: 1 }}>
         {info.isLoading ? (
           <View
             style={{
               ...StyleSheet.absoluteFill,
               alignItems: 'center',
               justifyContent: 'center'
             }}
           >
             <ActivityIndicator size='large' color={colors.primary} />
           </View>
         ) : null}

         <FlatList
           data={info.contacts}
           renderItem={renderItem}
           keyExtractor={(item, index) => index.toString()}
           ListHeaderComponent={
             <>
               <TouchableOpacity
                 style={{ flexDirection: 'row' }}
                 onPress={() => navigation.goBack()}
               >
                 <Ionicons name='chevron-back-outline' size={35} />
               </TouchableOpacity>
               <SearchBar
                 round
                 placeholder='Type here...'
                 onChangeText={text => filterContacts(text)}
                 value={search}
                 containerStyle={{
                   backgroundColor: 'transparent',
                   borderTopWidth: 0,
                   borderBottomWidth: 0,
                   margin: 10
                 }}
                 inputContainerStyle={{ backgroundColor: '#DDD' }}
                 inputStyle={{ color: '#000' }}
               />
             </>
           }
           ListEmptyComponent={() => (
             <View
               style={{
                 flex: 1,
                 alignItems: 'center',
                 justifyContent: 'center',
                 marginTop: 50
               }}
             >
               <Text style={{ color: colors.text }}>No Contacts Found</Text>
             </View>
           )}
         />
         <Modal
           animationType='none'
           transparent={true}
           visible={modalVisible}
           onRequestClose={() => {
             Alert.alert('Modal has been closed.')
           }}
         >
           <Pressable
             style={{
               flex: 1,
               justifyContent: 'center',
               backgroundColor: 'rgba(0,0,0,0.2)'
             }}
             onPress={() => setModalVisible(false)}
           >
             <Pressable
               style={{
                 backgroundColor: '#FFF',
                 borderRadius: 8,
                 paddingTop: 20,
                 paddingHorizontal: 30,
                 paddingBottom: 20,
                 alignItems: 'center',
                 shadowColor: '#000',
                 shadowOffset: {
                   width: 0,
                   height: 2
                 },
                 shadowOpacity: 0.25,
                 shadowRadius: 4,
                 elevation: 5,
                 margin: 40
               }}
             >
               <Text style={styles.modalText}>{modalMessage}</Text>
               <View>{listNumbers}</View>
             </Pressable>
           </Pressable>
         </Modal>
       </View>
       <View style={styles.submission}>
         { accessedFromEdit ? <View style={styles.selected}>
         <View
       style={{
         backgroundColor: '#DDD',
         padding: 8,
         borderRadius: 7,
         marginHorizontal: 5,
         marginVertical: 4
       }}
     >
         <Text style={{ color: '#198cff', fontSize: 16 }}>
         {tmpLink.name}
       </Text>
       </View>
         </View> : 
         <View style={styles.selected}>{listItems}</View>
         }
         <Button
           label='Submit'
           onPress={() => {

             validateLinks()
             /*
             console.log('LINKS', links)
             route.params.updateLinks(links)
             navigation.goBack()
             */
           }}
         />
       </View>
     </SafeAreaView>
   )
 }

 const { width } = Dimensions.get('window')

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center'
   },
   selected: {
     marginBottom: 20,
     flexDirection: 'row',
     flexWrap: 'wrap'
   },
   submission: {
     padding: 10,
     borderTopColor: 'slategray',
     borderTopWidth: 1
   },
   centeredView: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
     marginTop: 1
   },
   modalView: {
     margin: 20,
     backgroundColor: 'white',
     borderRadius: 20,
     padding: 40,
     alignItems: 'center',
     shadowColor: '#000',
     shadowOffset: {
       width: 0,
       height: 2
     },
     shadowOpacity: 0.25,
     shadowRadius: 3.84,
     elevation: 5
   },
   openButton: {
     backgroundColor: '#F194FF',
     borderRadius: 20,
     padding: 10,
     elevation: 2
   },
   textStyle: {
     color: 'white',
     fontWeight: 'bold',
     textAlign: 'center'
   },
   modalText: {
     marginBottom: 20,
     fontSize: 20
   }
 })