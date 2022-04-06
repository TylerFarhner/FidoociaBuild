import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Platform,
  Pressable,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth, db, fire, img } from "../utils/firebase";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/Button";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

function EditScreen({ route, navigation }) {
  const [newName, setNewName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newOtherOption, setNewOtherOption] = useState("");
  const [newProfileImage, setNewProfileImage] = useState("");
  const [myLinks2, setMyLinks] = useState([]);
  const [newLocation, setNewLocation] = useState("");
  const [editLocationFlag, setEditLocationFlag] = useState(false);
  const [linkPlaceholder, setLinkPlaceholder] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [newContacts, setNewContacts] = useState(contacts);
  const [validFirstName, setValidFirstName] = useState(true);
  const [validLastName, setValidLastName] = useState(true);
  const [validPhone, setValidPhone] = useState(true);
  const [validMeet, setValidMeet] = useState(true);
  const [validLoc, setValidLoc] = useState(true);
  const [validLinks, setValidLinks] = useState(true);
  var today = new Date();
  const [newStartTime, setNewStartTime] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [items, setItems] = useState([
    { label: "Bumble", value: "Bumble" },
    { label: "Hinge", value: "Hinge" },
    { label: "CoffeeMeetsBagel", value: "CoffeeMeetsBagel" },
    { label: "OkCupid", value: "OkCupid" },
    { label: "Tinder", value: "Tinder" },
    { label: "Other", value: "Other" },
  ]);

  const {
    scheduledDate,
    name,
    lastName,
    age,
    startTime,
    location,
    profileImage,
    contacts,
    isDateValid,
    date2,
    verifications,
    phoneNumber,
    ref,
    dateImg,
    loc,
  } = route.params;

  var contactsData = [];
  var listNumbers;

  useEffect(() => {
    console.log("start time", startTime);
    setNewStartTime(timeFix());
  }, [startTime]);

  const timeFix = () => {
    let hours,
      minutes = 0;

    if (startTime.length == 7) {
      hours = parseInt(startTime.substring(0, 2));
      minutes = parseInt(startTime.substring(3, 5));
    } else {
      hours = parseInt(startTime.substring(0, 1));
      minutes = parseInt(startTime.substring(2, 4));
    }

    if (startTime.includes("PM")) {
      hours += 12;
    }

    let newDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
      0
    );
    return newDate;
  };

  const updateLinks = (data) => {
    contactsData = data;
    console.log("HI", contactsData);
    setMyLinks(data);
  };

  const updateLocation = (data) => {
    // console.log('Setting Location to:', data);
    setNewLocation(data);
  };

  const validateFields = () => {
    console.log("validateFields ran");
    setValidFirstName(true);
    setValidLastName(true);
    setValidPhone(true);
    setValidMeet(true);
    setValidLoc(true);
    setValidLinks(true);

    if (newName == "" || newName.length < 2) {
      setValidFirstName(false);
    }
    if (newLastName == "" || newLastName.length < 2) {
      setValidLastName(false);
    }
    if (newPhoneNumber == "" || newPhoneNumber.length < 8) {
      setValidPhone(false);
    }
    if (value == null) {
      setValidMeet(false);
    }
    if (newLocation == "") {
      setValidMeet(false);
    }
    if (myLinks2.length <= 0) {
      setValidLinks(false);
    }
    console.log(
      validFirstName,
      validLastName,
      validPhone,
      validMeet,
      validLoc,
      validLinks
    );
    console.log("Results", newName, newLastName, myLinks2);
    console.log("validateFields done");
  };

  useEffect(() => {
    console.log("HERE", date2);
    console.log("EDIT FLAG", editLocationFlag);
    console.log(contacts);
  }, []);

  useEffect(() => {
    contactsData = contacts;
    console.log("Contacts Data", contactsData);
  }, [contacts]);

  const editLocation = () => {
    // setEditLocationFlag(true);
    navigation.navigate("Location", { updateLocation, editLocationFlag: true });
  };

  const convertStringToDate = (dateString) => {
    console.log("INCOMING", dateString);
    var formattedDate = new Date(dateString);
    var offsetFix = new Date(
      formattedDate.getTime() - formattedDate.getTimezoneOffset() * -60000
    ); // This will fix the -1 offset
    console.log("FORMATTED", offsetFix);
    return offsetFix.toDateString();
  };

  useEffect(() => {
    setLinkPlaceholder(`${contacts.map((contact) => contact.name)} `);

    console.log("ADDED", myLinks2);

    console.log("Link Placeholder", linkPlaceholder);
    console.log(newContacts);
    if (loc == null || loc == "") {
      console.log("No location has been selected");
    } else {
      setNewLocation(loc);
      console.log("Location selected", newLocation);
    }
  });

  useEffect(() => {
    console.log("Contact updated", contacts);
  }, [newContacts]);

  const formatTime = (time) => {
    var minutes = time.getMinutes();
    minutes = minutes > 9 ? minutes : "0" + minutes;

    let unformattedTime = `${time.getHours()}:${minutes}`;
    let hours = parseInt(unformattedTime.substring(0, 2));
    let formattedTime = "";

    if (hours > 12) {
      hours = hours - 12;
      formattedTime = `${hours}:${minutes}`;
      formattedTime = formattedTime.concat("PM");
    } else if (hours == 12) {
      formattedTime = `${hours}:${minutes}`;
      formattedTime = formattedTime.concat("PM");
    } else if (hours == 0) {
      formattedTime = `${12}:${minutes}`;
      formattedTime = formattedTime.concat("AM");
    } else {
      formattedTime = unformattedTime;
      formattedTime = formattedTime.concat("AM");
    }

    return formattedTime;
  };

  const updateFields = () => {
    console.log(ref);

    if (newPhoneNumber != phoneNumber && newPhoneNumber != "") {
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("phoneNumber")
        .set(newPhoneNumber);
    }

    if (newAge != age && newAge != "") {
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("age")
        .set(newAge);
    }

    if (newStartTime != startTime && newStartTime != "") {
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("startTime")
        .set(formatTime(newStartTime));
    }

    if (value != null) {
      console.log("HERE SELECTOR", value);
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("platform")
        .set(value);
      console.log(newOtherOption);
    }

    if (newOtherOption != "") {
      console.log("1", newOtherOption);
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("otherMeeting")
        .set(newOtherOption);
    }

    if (newLocation != location && newLocation != "") {
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("location")
        .set(newLocation);
    }

    if (myLinks2 != [] && myLinks2.length == 3) {
      fire
        .ref("users")
        .child(auth.currentUser.uid)
        .child("dates")
        .child(ref)
        .child("contacts")
        .set(myLinks2);
    }

    if (image != null) {
      // dateImg
      // fire.ref('users').child(auth.currentUser.uid).child('dates').child(ref).child("dateImg").set(image.uri);
      fetch(`data:image/jpeg;base64,${image.base64}`).then((res) =>
        res.blob().then((blob) => {
          // convert it to a blob
          const directoryRef = img.child(auth.currentUser.uid); // create a ref in Firebase storage with the current user's id
          // upload the image blob
          const fileRef = directoryRef.child((Math.random() * 10).toFixed(15));
          fileRef.put(blob).then(() =>
            // get the image's URL from Firebase once uploaded
            fileRef.getDownloadURL().then((url) => {
              fire
                .ref("users")
                .child(auth.currentUser.uid)
                .child("dates")
                .child(ref)
                .child("dateImg")
                .set(url);
            })
          );
        })
      );
    }

    Alert.alert("Add Images", `Would you like to add additional images?`, [
      {
        text: "No",
        onPress: () => navigation.navigate("Home"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => navigation.navigate("Gallery", { dateKey: ref }),
      },
    ]);
  };

  const updateStartTime = (event, selectedDate) => {
    const currentDate = selectedDate || startTime;
    setShow(Platform.OS === "ios");
    setNewStartTime(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  /* End of Datepicker */

  /*Phone Input Formatter*/

  const handlePhoneInput = (phoneNumber) => {
    // this is where we'll call our future formatPhoneNumber function that we haven't written yet.
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    // we'll set the input value using our setInputValue
    setNewPhoneNumber(formattedPhoneNumber);
  };

  function formatPhoneNumber(value) {
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;

    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");

    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;

    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early

    if (phoneNumberLength < 4) return phoneNumber;

    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }

    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  }

  const [image, setImage] = useState(null);

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then(
      ({ status }) =>
        status !== "granted" &&
        alert("Sorry, we need camera roll permissions to make this work!")
    );
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
      base64: true,
    });

    if (!result.cancelled) {
      setImage(result);
      console.log(image.uri);
    }
  };

  const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const editLinks = () => {
    setModalOpen(true);
    // navigation.navigate('Contacts', { updateLinks }
  };

  const editContacts = () => {
    setContactModalOpen(true);
  };

  const handleContinue = () => {
    setModalOpen(false);
    setContactModalOpen(false);
    navigation.navigate("Contacts", {
      updateLinks,
      oldContacts: contacts,
      accessedFromEdit: true,
    });
  };

  const saveInfo = () => {
    // new Promise (())

    validateFields();
    // fetch the base64 image data
    fetch(`data:image/jpeg;base64,${image.base64}`).then((res) =>
      res.blob().then((blob) => {
        // convert it to a blob
        const directoryRef = img.child(auth.currentUser.uid); // create a ref in Firebase storage with the current user's id
        // upload the image blob
        const fileRef = directoryRef.child((Math.random() * 10).toFixed(15));
        fileRef.put(blob).then(() =>
          // get the image's URL from Firebase once uploaded
          fileRef.getDownloadURL().then((url) => {
            let datesRef = fire
              .ref("users")
              .child(auth.currentUser.uid)
              .child("dates")
              .push();

            let newDateProfile = {
              name,
              lastName,
              phoneNumber,
              contacts: myLinks,
              date: date.toDateString(),
              scheduledDate,
              startTime,
              dateImg: url,
              age: getAge(date),
              platform: value,
              location,
              otherMeeting: other,
            };

            if (image == null) {
              alert("Please submit a profile picture of your date.");
            } else {
              console.log(
                "FIELDS",
                validFirstName,
                validLastName,
                validPhone,
                validMeet,
                validLoc,
                validLinks
              );
              if (
                validFirstName &&
                validLastName &&
                validPhone &&
                validMeet &&
                validLoc &&
                validLinks
              ) {
                console.log("Profile to be submitted: ", newDateProfile);
                datesRef.set(newDateProfile);
                db.collection('users')
                  .doc(auth.currentUser.uid)
                  .collection("verification")
                  .doc(`${newDateProfile.name} ${newDateProfile.lastName}`)
                  .set({
                    verified: false,
                  });
                // navigation.navigate('Gallery', { dateKey: datesRef.key })
                navigation.navigate("Home");
              } else {
                alert(
                  "Please make sure all the fields are filled out properly."
                );
              }
            }
          })
        );
      })
    );
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <SafeAreaView style={{ alignSelf: "flex-start" }}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back-outline"
          size={40}
          style={{ paddingLeft: 12 }}
        />
      </SafeAreaView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          setModalOpen(!isModalOpen);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
          onPress={() => setModalOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: "#FFF",
              borderRadius: 8,
              paddingTop: 30,
              paddingHorizontal: 30,
              paddingBottom: 10,
              alignItems: "center",
              shadowColor: "#000",
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
            <Text
              style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
            >
              Replace Contact{" "}
            </Text>
            <Text style={{ fontSize: 14.5, marginBottom: 10 }}>
              Please select contact to replace.{" "}
            </Text>
            {contacts.map((contact, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (contacts.length <= 2) {
                    alert("You've already selected a contact to replace.");
                  } else {
                    contacts.splice(i, 1);
                    setNewContacts(contacts);
                    console.log("NEW CONTACTS", newContacts);
                  }
                }}
              >
                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                  {/* style={styles.emergencyContacts} */}
                  <Text style={{ fontSize: 15, alignItems: "flex-start" }}>
                    {contact.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <Button
              label="Continue"
              onPress={() => {
                handleContinue();
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isContactModalOpen}
        onRequestClose={() => {
          setContactModalOpen(!isContactModalOpen);
        }}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
          onPress={() => setContactModalOpen(false)}
        >
          <Pressable
            style={{
              backgroundColor: "#FFF",
              borderRadius: 8,
              paddingTop: 30,
              paddingHorizontal: 30,
              paddingBottom: 10,
              alignItems: "center",
              shadowColor: "#000",
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
            <Text
              style={{ fontSize: 20, marginBottom: 10, fontWeight: "bold" }}
            >
              Replace Contact{" "}
            </Text>
            <Text style={{ fontSize: 14.5, marginBottom: 10 }}>
              Please select contact to replace.{" "}
            </Text>
            {myLinks2.map((contact, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  if (myLinks2.length <= 2) {
                    alert("You've already selected a contact to replace.");
                  } else {
                    let contactsArr = myLinks2;
                    contactsArr.splice(i, 1);
                    setNewContacts(contactsArr);
                    setMyLinks(contactsArr);
                    /*
                  for(let i = 0; i < contactsArr.length; i++){
                    setMyLinks(links => [...links, contactsArr[i]])
                  }
                  */
                    console.log("NEW CONTACTS", newContacts);
                  }
                }}
              >
                <View style={{ flexDirection: "row", marginVertical: 8 }}>
                  {/* style={styles.emergencyContacts} */}
                  <Text style={{ fontSize: 15, alignItems: "flex-start" }}>
                    {contact.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            <Button
              label="Continue"
              onPress={() => {
                handleContinue();
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 24, fontWeight: "500", textAlign: "center" }}>
          Update date with
        </Text>
        <Text style={styles.textContainer}>
          <Text>
            {name} {lastName}
          </Text>{" "}
        </Text>
        <TouchableOpacity onPress={pickImage}>
          <View
            style={{
              marginTop: 25,
              flex: 1,
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            {image ? (
              <Image
                source={{ uri: image.uri }}
                style={{
                  width: width / 2.5,
                  height: width / 2.5,
                  borderRadius: width / 4,
                }}
              />
            ) : (
              <Image
                source={{
                  uri: dateImg,
                }}
                style={{
                  width: width / 2.5,
                  height: width / 2.5,
                  borderRadius: width / 4,
                }}
              />
            )}
          </View>
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: width / 3.5,
            marginBottom: height / 50,
          }}
        ></Text>
        <Text style={styles.formLabel}>Time of Date</Text>
        <DateTimePicker
          testID="dateTimePicker"
          value={newStartTime}
          mode="time"
          is24Hour={true}
          display="compact"
          onChange={updateStartTime}
          style={{
            marginBottom: height / 50,
            lineHeight: width / 22,
            fontSize: width / 20,
            backgroundColor: "#FFFFFF",
            color: "black",
            paddingVertical: width / 25,
            paddingLeft: width / 50,
            height: height / 22,
            width: width - 3 * (width / 20),
            borderRadius: width / 75,
          }}
        />
        <Text style={styles.formLabel}>Age</Text>
        <TextInput
          placeholder={age.toString()}
          placeholderTextColor={"slategray"}
          style={{
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
          keyboardType="phone-pad"
          onChangeText={(text) => setNewAge(text)}
          value={newAge}
        />
        <Text style={styles.formLabel}>Phone Number</Text>
        <TextInput
          value={newPhoneNumber}
          maxLength={14}
          placeholder={phoneNumber}
          placeholderTextColor={"slategray"}
          autoCapitalize="words"
          keyboardType="phone-pad"
          autoCompleteType="tel"
          autoCorrect={false}
          returnKeyType="next"
          onChangeText={(newPhoneNumber) => handlePhoneInput(newPhoneNumber)}
          style={{
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
        {validPhone ? null : (
          <Text style={styles.errorMsg}>
            Please enter a valid phone number.
          </Text>
        )}
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
          dropDownDirection="BOTTOM"
          style={{
            flexGrow: 1,
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
        {validMeet ? null : (
          <Text style={styles.errorMsg}>Please select an option.</Text>
        )}
        {value == "Other" ? (
          <View>
            <Text style={{ marginBottom: 10 }}>
              Please tell us where you met
            </Text>
            <TextInput
              value={newOtherOption}
              placeholder="ex. Instagram"
              placeholderTextColor={"slategray"}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              onChangeText={(newOtherOption) =>
                setNewOtherOption(newOtherOption)
              }
              style={{
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
          </View>
        ) : (
          <View></View>
        )}
        <Text style={styles.formLabel}>Date Location</Text>
        {Object.keys(newLocation).length === 0 ? (
          <TextInput
            value={""}
            placeholder={location.name}
            placeholderTextColor={"slategray"}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onChangeText={(name) => setName(name)}
            onFocus={() => {
              editLocation();
            }}
            style={styles.formInput}
          />
        ) : (
          <TextInput
            value={""}
            placeholder={`${newLocation.name}`}
            placeholderTextColor={"black"}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onChangeText={(name) => setName(name)}
            onFocus={() => {
              editLocation();
            }}
            style={styles.formInput}
          />
        )}
        <Text style={styles.formLabel}>Emergency Contacts</Text>
        {myLinks2.length == 0 ? (
          <TextInput
            value={""}
            placeholder={linkPlaceholder}
            placeholderTextColor={"slategray"}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onFocus={() => {
              editLinks();
            }}
            onChangeText={() => console.log("")}
            style={styles.formInput}
          />
        ) : (
          <TextInput
            value={""}
            placeholder={`${myLinks2.map((link) => link.name)}`}
            placeholderTextColor={"black"}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="next"
            onFocus={() => {
              editContacts();
            }}
            onChangeText={() => console.log("")}
            style={styles.formInput}
          />
        )}
        {validLinks ? null : (
          <Text style={styles.errorMsg}>Please select your links.</Text>
        )}
        {/* <Button onPress={()=>{console.log(isModalOpen)}} label='Links' /> */}
        <Button onPress={updateFields} label="Update" />
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  errorMsg: {
    color: "red",
    marginTop: -10,
    marginBottom: 15,
  },
  textContainer: {
    fontSize: 24,
    alignSelf: "center",
    width: 300,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
    color: "#006ee6",
    backgroundColor: "#EEE",
    paddingVertical: 12,
    borderRadius: 10,
    letterSpacing: 0.65,
    overflow: "hidden",
  },
  formInput: {
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
  },
  formLabel: {
    marginBottom: 10,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default EditScreen;
