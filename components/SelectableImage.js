import React from "react";
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SelectableImage = (
  { image: { uri }, selectedImages, setSelectedImages },
  ...rest
) => {
  const selected = selectedImages.includes(uri);
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (selected) {
          setSelectedImages(selectedImages.filter((imgUri) => imgUri !== uri));
        } else {
          if (selectedImages.length !== 6)
            setSelectedImages([...selectedImages, uri]);
        }
      }}
    >
      <View>
        <Image
          source={{ uri: uri }}
          {...rest}
          style={{
            height: Dimensions.get("screen").width / 3.2,
            width: Dimensions.get("screen").width / 3.2,
            zIndex: 0,
            borderWidth: 0.5,
            borderColor: "#000",
          }}
        />
        {selected && (
          <>
            <Ionicons
              name="checkmark-circle"
              size={30}
              color={"#4da2ff"}
              style={{
                zIndex: 1,
                position: "absolute",
                bottom: 0,
                right: 0,
                borderRadius: 5,
              }}
            />
            <View style={styles.selectedImageOverlay} />
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  selectedImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});

export default SelectableImage;
