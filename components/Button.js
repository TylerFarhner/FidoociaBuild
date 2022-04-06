import React from "react";
import { Pressable, Text, Dimensions } from "react-native";

const {width, height} = Dimensions.get("window");
const Button = ({ label, buttonWidth, labelStyle, noFill, icon, color, ...rest }) => {
  const styles = {
    button: {
      flexDirection: "row",
      justifyContent: "center",
      backgroundColor: noFill ? "transparent" : color || "#198cff",
      width: buttonWidth || "100%",
      paddingVertical: height/55,
      borderRadius: width/50,
      marginBottom: height/75,
    },
    label: {
      color: noFill ? "#333" : "#FFF",
      fontSize: width/25,
      fontWeight: "500",
      textAlign: "center",
    },
  };

  return (
    <Pressable style={styles.button} {...rest}>
      <Text style={labelStyle || styles.label}>{label}</Text>
      {icon}
    </Pressable>
  );
};

export default Button;
