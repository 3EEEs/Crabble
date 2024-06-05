import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import AntIcon from "react-native-vector-icons/AntDesign";

const Square = ({
  value,
  content = null,
  isSelected = false,
  isCenter = false,
  onSelect,
  isInWord = [],
}) => {
  const handlePress = () => {
    onSelect(value);
  };

  const { width } = Dimensions.get("window");

  // Create the base styles
  const baseStyles = {
    height: width / 9, // Adjust the divisor to change the size as needed
    width: width / 9, // Adjust the divisor to change the size as needed
    borderWidth: content ? 0.5 : 2,
    borderColor: content ? "burlywood" : "white",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    backgroundColor: content ? "bisque" : "darkseagreen",
  };

  // Conditionally add styles
  if (isCenter && !content) {
    baseStyles.backgroundColor = "lightcoral";
  }

  if (isSelected) {
    baseStyles.borderColor = "sandybrown";
    baseStyles.borderWidth = 3;
  }

  if (isInWord.includes(value)) {
    baseStyles.borderColor = "#90EE90";
    baseStyles.borderWidth = 2;
  }

  // Additional conditionals to modify borders based on adjacent cells
  if (isInWord.includes(value + 1)) {
    baseStyles.borderRightWidth = 0;
  }
  if (isInWord.includes(value - 1)) {
    baseStyles.borderLeftWidth = 0;
  }
  if (isInWord.includes(value + 9)) {
    baseStyles.borderBottomWidth = 0;
  }
  if (isInWord.includes(value - 9)) {
    baseStyles.borderTopWidth = 0;
  }

  const dynamicStyles = StyleSheet.create({
    cell: baseStyles,
    star: {
      position: "absolute",
      zIndex: 0, // Ensure the star is behind the content
    },
    content: {
      zIndex: 1, // Ensure the content is on top of the star
      fontFamily: "Seymour One",
      fontSize: 30,
    },
  });

  return (
    <View style={styles.shadowProp}>
      <TouchableOpacity
        style={[
          dynamicStyles.cell,
          isCenter && !content && styles.centerCell,
          isSelected && styles.selectedCell,
        ]}
        onPress={handlePress}
      >
        {isCenter && !content && (
          <AntIcon
            name="star"
            size={30}
            style={dynamicStyles.star}
            color="white"
          />
        )}
        <Text style={dynamicStyles.content}>{content}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centerCell: {
    backgroundColor: "lightcoral", // Set your desired background color for the center cell
  },
  selectedCell: {
    borderColor: "sandybrown",
    borderWidth: 3,
  },
  blueBackground: {
    backgroundColor: "#87CEEB", // SkyBlue
  },
  isInWord: {
    borderColor: "#90EE90",
    borderWidth: 2,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Square;
