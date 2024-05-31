import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

const Square = ({ value, content, isSelected, isCenter, onSelect }) => {
  const handlePress = () => {
    onSelect(value);
  };

  const { width, height } = Dimensions.get("window");

  // Create a dynamic style based on screen dimensions
  const dynamicStyles = StyleSheet.create({
    cell: {
      height: width / 9, // Adjust the divisor to change the size as needed
      width: width / 9, // Adjust the divisor to change the size as needed
      borderWidth: 1,
      borderColor: "black",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  return (
    <TouchableOpacity
      style={[
        dynamicStyles.cell,
        isCenter && styles.centerCell,
        isSelected && styles.selectedCell,
        content,
      ]}
      onPress={handlePress}
    >
      <Text>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  centerCell: {
    backgroundColor: "lightcoral", // Set your desired background color for the center cell
  },
  selectedCell: {
    borderColor: "sandybrown",
    //backgroundColor: "lightyellow",
    borderWidth: 3,
  },
  blueBackground: {
    backgroundColor: "#87CEEB", //SkyBlue
  },
});

export default Square;
