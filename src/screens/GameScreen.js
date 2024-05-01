import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Board from "../components/Board";
import Inventory from "../components/Inventory";
import createArray from "../components/CreateArray";
import Word from "../components/Word";

// Game variables
size = 9;

const GameScreen = () => {
  //Add that it selects the middle square no matter the size of the board
  const [selectedCell, setSelectedCell] = useState(41); // Define selectedCell state

  const [content, setContent] = useState(createArray(size, ""));

  console.log("Content: " + content);

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
        content={content}
        setContent={setContent}
        startingLetters={7}
        start={false}
        size={size}
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
