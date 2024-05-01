import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import getWordDefinition from "../api/getWordDefinition";

const Inventory = ({
  size,
  selectedCell,
  setSelectedCell,
  content,
  setContent,
}) => {
  const startingLetters = 7;
  const tileDistribution = {
    A: 9,
    B: 2,
    C: 2,
    D: 4,
    E: 12,
    F: 2,
    G: 3,
    H: 2,
    I: 9,
    J: 1,
    K: 1,
    L: 4,
    M: 2,
    N: 6,
    O: 8,
    P: 2,
    Q: 1,
    R: 6,
    S: 4,
    T: 6,
    U: 4,
    V: 2,
    W: 2,
    X: 1,
    Y: 2,
    Z: 1,
    "@": 2,
  };

  const [letters, setLetters] = useState([]);
  const [tileBag, setTileBag] = useState([]);
  const [word, setWord] = useState([]);
  const [definition, setDefinition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    replenishTiles();
  }, []);

  const replenishTiles = () => {
    const newLetters = [];
    const newTileBag = [];
    for (const letter in tileDistribution) {
      const count = tileDistribution[letter];
      for (let i = 0; i < count; i++) {
        newTileBag.push(letter);
      }
    }
    setTileBag(newTileBag);

    for (let i = 0; i < startingLetters; i++) {
      const randomIndex = Math.floor(Math.random() * newTileBag.length);
      newLetters.push(newTileBag[randomIndex]);
      newTileBag.splice(randomIndex, 1);
    }
    setLetters(newLetters);
  };

  const drawTile = () => {
    if (tileBag.length > 0) {
      const randomIndex = Math.floor(Math.random() * tileBag.length);
      const randomCharacter = tileBag[randomIndex];
      setTileBag(tileBag.filter((_, index) => index !== randomIndex));

      // Update letters state with the newly drawn tile
      setLetters([...letters, randomCharacter]);
    }
  };

  const selectLetter = (letter) => {
    selectedCell = selectedCell - 1;

    if (selectedCell !== null) {
      console.log("Selected Cell: ", selectedCell);
      const row = Math.floor(selectedCell / size);
      const col = selectedCell % size;
      const newContent = [...content];
      newContent[row][col] = letter;
      setContent(newContent);
      setSelectedCell(selectedCell + 2);
      setLetters(letters.filter((l) => l !== letter));

      // Append the selected letter to the word
      setWord((prevWord) => {
        const newWord = [...prevWord, letter];
        console.log("Current word:", newWord.join("")); // Log the current word string
        return newWord;
      });
    }
  };

  const checkWord = async () => {
    try {
      if (word.length === 0) {
        setErrorMessage("No word to check.");
        return;
      }

      const wordString = word.join("").toLowerCase(); // Join letters and convert to lowercase
      const response = await getWordDefinition(wordString);

      if (response && response.length > 0) {
        const wordData = response[0];
        const word = wordData.word;
        const meanings = wordData.meanings;
        const firstMeaning = meanings[0];

        if (
          word &&
          firstMeaning &&
          firstMeaning.definitions &&
          firstMeaning.definitions.length > 0
        ) {
          const wordDefinition = firstMeaning.definitions[0].definition;
          setDefinition(`${word}: ${wordDefinition}`);
          setErrorMessage("");
        } else {
          setErrorMessage("No definition found for the word.");
        }
      } else {
        setErrorMessage("No data found for the word.");
      }
    } catch (error) {
      setErrorMessage("Error fetching word definition.");
      // Return the letters in the word back to inventory
      setLetters((prevLetters) => [...prevLetters, ...word]); // Use functional update to ensure the latest state
      for (let i = 0; i < word.length; i++) {
        console.log("Here is the letter:", word[i]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidePanel}>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={styles.letter}
              onPress={() => selectLetter(letter)}
            >
              <Text>{letter}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Draw Tile" onPress={drawTile} />
        <Button title="Check Word" onPress={checkWord} />
        {errorMessage ? <Text>{errorMessage}</Text> : null}
        {definition ? <Text>{definition}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  board: {
    flex: 2,
    padding: 10,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
  },
  sidePanel: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  lettersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  letter: {
    padding: 10,
    margin: 5,
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
  },
});

export default Inventory;
