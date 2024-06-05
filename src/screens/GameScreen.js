import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Alert, Text } from "react-native";
import { Audio } from "expo-av"; // Import Audio from expo-av
import Board from "../components/Board";
import Inventory from "../components/Inventory";
import createArray from "../components/CreateArray";

// Game variables
const size = 9; // Or the number of cells on the board, should be adjustable

const GameScreen = () => {
  const [letters, setLetters] = useState(["A", "B", "C", "D", "E", "F", "G"]); // Initial letters
  const [content, setContent] = useState(createArray(size, ""));
  const [word, setWord] = useState([]);
  const [direction, setDirection] = useState("");
  const [addedLetters, setAddedLetters] = useState([]); // Initialize addedLetters state
  const [selectedCell, setSelectedCell] = useState(40); // Initially middle cell (adjust if size changes)

  // array of location storing
  const [isInWord, setIsInWord] = useState([]);

  const { width } = Dimensions.get("window");
  const boardWidth = width;

  // Reference to the sound object
  const soundRef = useRef(new Audio.Sound());

  // Load the sound file when the component mounts
  useEffect(() => {
    const loadSound = async () => {
      try {
        await soundRef.current.loadAsync(
          require("../../assets/sounds/dropSound.mp3"),
        );
      } catch (error) {
        console.error("Error loading sound: ", error);
      }
    };

    loadSound();

    // Unload the sound when the component unmounts
    return () => {
      soundRef.current.unloadAsync();
    };
  }, []);

  // Function to play the sound
  const playSound = async () => {
    try {
      await soundRef.current.replayAsync();
    } catch (error) {
      console.error("Error playing sound: ", error);
    }
  };

  //As of currently, there is no fix for the error I am hiding. The devs or I have to fix it upstream before I can implement a solution
  const error = console.error;
  console.error = (...args) => {
    if (/defaultProps/.test(args[0])) return;
    error(...args);
  };

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
        return false;
      }

      // Flatten
      const flat = row * size + col + 1;
      console.log("Flat = " + flat);

      // Highlight the new letter in the word
      setIsInWord((prev) => [...prev, flat]);
      newContent[row][col] = letter;
      setContent(newContent);
      console.log("Is In Word: " + isInWord);

      // Play sound
      playSound();

      // Determine the direction
      let newDirection = "h"; // Default to horizontal
      if (
        (col > 0 && newContent[row][col - 1] !== "") ||
        (col < size - 1 && newContent[row][col + 1] !== "")
      ) {
        newDirection = "h"; // Horizontal if there's a letter to the left or right
      } else if (
        (row > 0 && newContent[row - 1][col] !== "") ||
        (row < size - 1 && newContent[row + 1][col] !== "")
      ) {
        newDirection = "v"; // Vertical if there's a letter above or below
      }
      setDirection(newDirection);

      // Call selectLetter with the new row, column, letter, and direction
      selectLetter(row, col, letter, newDirection);

      // Remove the letter from the inventory
      const newLetters = [...letters];
      const letterIndex = newLetters.indexOf(letter);
      if (letterIndex !== -1) {
        newLetters.splice(letterIndex, 1);
        setLetters(newLetters);
      }

      // Add the letter and its position to the addedLetters array
      setAddedLetters((prev) => [...prev, { row, col, letter }]);

      return true;
    }
  };

  const selectLetter = (row, col, letter, newDirection) => {
    let newWord = [];
    const newContent = [...content];
    let newIsInWord = [];

    // Update word and isInWord based on the content of the row or column
    if (newDirection === "h") {
      for (let i = 0; i < size; i++) {
        newWord.push(newContent[row][i] || ""); // Add empty tiles for empty cells
        if (newContent[row][i] !== "") {
          newIsInWord.push(row * size + i + 1); // Add to isInWord
        }
      }
    } else {
      for (let i = 0; i < size; i++) {
        newWord.push(newContent[i][col] || ""); // Add empty tiles for empty cells
        if (newContent[i][col] !== "") {
          newIsInWord.push(i * size + col + 1); // Add to isInWord
        }
      }
    }

    setWord(newWord.filter((tile) => tile !== "")); // Filter out empty tiles for the word

    // Update isInWord with new connected letters
    setIsInWord((prev) => [...new Set([...prev, ...newIsInWord])]);

    // Log the current word
    console.log("Current word:", newWord.join(""));
  };

  return (
    <View style={styles.container}>
      <Board
        content={content}
        setContent={setContent}
        size={size}
        start={true}
        isInWord={isInWord}
        setIsInWord={setIsInWord}
      />
      <Inventory
        letters={letters}
        setLetters={setLetters}
        content={content}
        setContent={setContent}
        startingLetters={7}
        start={false}
        size={size}
        handleDrop={handleDrop} // Passing down the handleDrop function
        word={word}
        setWord={setWord}
        isInWord={isInWord}
        setIsInWord={setIsInWord}
      />
      <View style={styles.wordContainer}>
        <Text>Current Word: {word.join("")}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  wordContainer: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
});

export default GameScreen;
