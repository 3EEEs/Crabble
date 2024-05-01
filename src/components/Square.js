import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const Square = ({ value, content, isSelected, isCenter, onSelect }) => {
  const handlePress = () => {
    onSelect(value);
  };

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        isCenter && styles.centerCell,
        isSelected && styles.selectedCell,
        content && styles.blueBackground,
      ]}
      onPress={handlePress}
    >
      <Text>{content}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
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
