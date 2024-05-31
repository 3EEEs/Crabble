import React, { useState } from "react";
import { View, StyleSheet, Dimensions, Alert } from "react-native";
import Board from "../components/Board";
import Inventory from "../components/Inventory";
import createArray from "../components/CreateArray";
import Word from "../components/Word";

// Game variables
size = 9; // Or the number of cells on the board, should be adjustable

const GameScreen = () => {
  //Add that it selects the middle square no matter the size of the board
  const [selectedCell, setSelectedCell] = useState(41); // Define selectedCell state
  const [letters, setLetters] = useState([]);
  const [content, setContent] = useState(createArray(size, ""));

  const { width } = Dimensions.get("window");

  const boardWidth = width;

  // console.log("Board Height is: " + boardHeight);
  // console.log("Board Width is: " + boardWidth);

  console.log("Content: " + content);

  const handleDrop = (event, letter) => {
    // Calculate the size of each cell
    const cellSize = boardWidth / size;

    // Get the drop location (event.nativeEvent.pageX, event.nativeEvent.pageY)
    const dropX = event.nativeEvent.pageX;
    const dropY = event.nativeEvent.pageY;

    // Determine the grid cell based on dropX and dropY
    const row = Math.floor((dropY - 80) / cellSize); // Adjust based on your layout
    const col = Math.floor(dropX / cellSize);

    // Now update the content at the dropped location
    const newContent = [...content];
    if (row >= 0 && row < size && col >= 0 && col < size) {
      if (newContent[row][col] !== "") {
        Alert.alert("Error", "This tile is already occupied.");
        return;
      }
      newContent[row][col] = letter;
      setContent(newContent);

      // Remove the letter from the inventory
      const newLetters = [...letters];
      const letterIndex = newLetters.indexOf(letter);
      if (letterIndex !== -1) {
        newLetters.splice(letterIndex, 1);
        setLetters(newLetters);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Board
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        content={content}
        setContent={setContent}
        size={size}
        start={true}
      />
      <Inventory
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        letters={letters}
        setLetters={setLetters}
        content={content}
        setContent={setContent}
        startingLetters={7}
        start={false}
        size={size}
        handleDrop={handleDrop} // Passing down the handleProp Function
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default GameScreen;
