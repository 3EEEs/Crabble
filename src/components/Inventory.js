import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import TileBag from "./TileBag"; // Import the TileBag component
import Draggable from "react-native-draggable";
import getWordDefinition from "../api/getWordDefinition";

const Inventory = ({
  size,
  content,
  setContent,
  handleDrop,
  letters,
  setLetters,
  word,
  setWord,
  isInWord,
  setIsInWord,
}) => {
  size = size || 100; // Use default parameter value for size
  content = content || []; // Use default parameter value for content
  setContent = setContent || (() => {}); // Use default parameter value for setContent
  const startingLetters = 7;
  const [tileBag, setTileBag] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [tileDistribution, setTileDistribution] = useState({}); // Initialize tile distribution as state
  const [definition, setDefinition] = useState(""); // Add definition state

  useEffect(() => {
    const distribution = TileBag(); // Get the tile distribution from TileBag component
    setTileDistribution(distribution); // Set tile distribution state
    replenishTiles(distribution); // Pass the distribution to replenishTiles
  }, []);

  const replenishTiles = (distribution) => {
    const newLetters = [];
    const newTileBag = [];
    for (const letter in distribution) {
      const count = distribution[letter];
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
      setLetters((prevLetters) => [...prevLetters, randomCharacter]);
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
      console.log("Content:", content);

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
          console.log("Correct word!");

          setIsInWord([]);
          setWord([]);

          // Replace the letters used with new ones
          console.log("Replacing Letters...");
          const lettersToReplace = 7 - letters.length; // Calculate the number of tiles to draw
          for (let i = 0; i < lettersToReplace; i++) {
            drawTile();
          }

          setErrorMessage("");
        } else {
          setErrorMessage("No definition found for the word.");
        }
      } else {
        setErrorMessage("No data found for the word.");
      }
    } catch (error) {
      if (error.message === "Request failed with status code 404") {
        setErrorMessage("Sorry, no definitions found for this word.");
      } else {
        setErrorMessage("An error occurred while fetching word definition.");
      }
      // Return the letters in the word back to inventory
      setLetters((prevLetters) => [...prevLetters, ...word]); // Use functional update to ensure the latest state
      for (let i = 0; i < word.length; i++) {
        console.log("Letter returned to inventory:", word[i]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidePanel}>
        <Text style={styles.title}>Inventory</Text>
        <View style={styles.lettersContainer}>
          {letters.map((letter, index) => (
            <Draggable
              key={index}
              x={(index % 7) * 52.5} // Adjust the spacing as needed
              y={Math.floor(index / 7) * 50} // Adjust the spacing as needed, multiplying by 2 for better spacing
              shouldReverse
              onDragRelease={(event) => {
                const check = handleDrop(event, letter);
                console.log("Check: " + check);
              }}
            >
              <View style={styles.shadowProp}>
                <View style={styles.letter}>
                  <Text>{letter}</Text>
                </View>
              </View>
            </Draggable>
          ))}
        </View>
        <View style={styles.buttons}>
          <Button title="Draw Tile" onPress={drawTile} />
          <Button
            title="Check Word"
            onPress={() => {
              checkWord();
              console.log("Button Pressed");
            }}
          />
        </View>
        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
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
    justifyContent: "top",
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
    alignItems: "center",
    width: "100%",
    flexGrow: 1, // Allow lettersContainer to grow and take available space
  },
  letter: {
    margin: 5,
    //padding: 10,
    backgroundColor: "bisque",
    borderRadius: 1,
    borderWidth: 0.5,
    borderColor: "burlywood",
    width: 45, // Set the width to a fixed value
    height: 45, // Set the height to a fixed value
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  buttons: {
    alignSelf: "flex-end",
    marginTop: "auto", // Push buttons to the bottom
    width: "100%", // Ensure buttons take full width
    alignItems: "center", // Center buttons horizontally
    paddingBottom: 10,
  },
  error: {
    color: "red", // Style the error message to be more visible
    marginTop: 10,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default Inventory;
