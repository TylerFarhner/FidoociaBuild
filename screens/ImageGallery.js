import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Dimensions,
  StyleSheet,
  Button,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, img, rt } from "../backend/firebase";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import SelectableImage from "../components/SelectableImage";

function ImageGallery({ route, navigation }) {
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    ImagePicker.requestMediaLibraryPermissionsAsync().then(({ status }) => {
      // this will request acccess to the user's gallery
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      } else {
        MediaLibrary.getAssetsAsync({ first: 9999 }).then(
          (
            { assets } // display the first 20 photos from the phone's image library
          ) => setImages(assets.map(({ uri }) => ({ uri, selected: false })))
        );
      }
    });
  }, []);

  const uploadToFB = () => {
    const imagesRef = rt.ref(
      `users/${auth.currentUser.uid}/dates/${route.params.dateKey}/verificationImages`
    );
    selectedImages.forEach((uri) =>
      fetch(uri).then((res) =>
        res.blob().then((blob) => {
          const directoryRef = img.child(auth.currentUser.uid);
          const fileRef = directoryRef.child((Math.random() * 10).toFixed(15));
          fileRef.put(blob).then(() =>
            // upload the image blob
            fileRef.getDownloadURL().then(
              (url) => imagesRef.push(url)
              // get the image's URL from Firebase once uploaded
            )
          );
        })
      )
    );
    navigation.navigate("Home");
    alert("Date created");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ alignSelf: "flex-start" }}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back-outline"
          size={40}
          style={{ paddingLeft: 12 }}
        />
      </SafeAreaView>
      <Ionicons name="camera" size={width / 5} style={styles.galleryIcon} />
      <Text style={styles.paragraph}>
        Please upload any screenshots (max 6 images) of your date's social media
        profiles and relevant media. This will assist us with validating their
        profile.
      </Text>
      <Button title="Submit" onPress={uploadToFB} />
      <Text style={styles.selectedNumber}>
        {selectedImages.length} images selected
      </Text>
      <FlatList
        data={images}
        numColumns={3}
        renderItem={({ item, index }) => (
          <SelectableImage
            image={item}
            index={index}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height / 10,
    backgroundColor: "#ecf0f1",
  },
  galleryIcon: {
    alignSelf: "center",
  },
  selectedNumber: {
    fontSize: 16,
    alignSelf: "center",
    marginVertical: 15,
  },
  paragraph: {
    marginVertical: 16,
    marginHorizontal: 28,
    fontSize: 16,
    textAlign: "left",
  },
});

export default ImageGallery;
