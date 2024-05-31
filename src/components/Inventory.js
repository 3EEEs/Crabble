import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  Dimensions,
} from "react-native";
import TileBag from "./TileBag"; // Import the TileBag component
import Draggable from "react-native-draggable";

const Inventory = ({
  size = 100,
  selectedCell = null,
  setSelectedCell = () => {},
  content = [],
  setContent = () => {},
  handleDrop,
  letters,
  setLetters,
}) => {
  const startingLetters = 7;
  const [tileBag, setTileBag] = useState([]);
  const [word, setWord] = useState([]);
  const [definition, setDefinition] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [direction, setDirection] = useState("");
  const [tileDistribution, setTileDistribution] = useState({}); // Initialize tile distribution as state

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
      setLetters([...letters, randomCharacter]);
    }
  };

  const selectLetter = (letter) => {
    let newWord = [];

    selectedCell = selectedCell - 1;

    if (selectedCell !== null) {
      console.log("Selected Cell: ", selectedCell);
      const row = Math.floor(selectedCell / size);
      const col = selectedCell % size;
      const newContent = [...content];
      newContent[row][col] = letter;
      setContent(newContent);

      // Find the index of the first occurrence of the selected letter in letters array
      const letterIndex = letters.indexOf(letter);
      if (letterIndex !== -1) {
        // Remove the selected letter from the letters array
        const newLetters = [...letters];
        newLetters.splice(letterIndex, 1);
        setLetters(newLetters);
      }

      // Find the index of the first occurrence of the selected letter in tileBag array
      const tileIndex = tileBag.indexOf(letter);
      if (tileIndex !== -1) {
        // Remove the selected letter from the tileBag array
        const newTileBag = [...tileBag];
        newTileBag.splice(tileIndex, 1);
        setTileBag(newTileBag);
      }

      // Check if there's a letter in the adjacent cell to the left or right
      if (col > 0 && newContent[row][col - 1] !== "") {
        setDirection("h"); // Set direction to left
        console.log("Set direction to horizontal");
      } else if (
        col < newContent[row].length - 1 &&
        newContent[row][col + 1] !== ""
      ) {
        setDirection("h"); // Set direction to right
        console.log("Set direction to horizontal");
      }

      // Check if there's a letter in the adjacent cell above
      if (row > 0 && newContent[row - 1][col] !== "") {
        setDirection("h"); // Set direction to vertical
        console.log("Set direction to Vertical");
      }

      // If direction is still empty, default to vertical
      if (direction === "") {
        setDirection("v");
        console.log("Set direction to Vertical");
      }

      setSelectedCell(selectedCell + 2);

      //First check if the word being spelled is horizontal
      // Update word based on the content of the row
      if (direction === "h") {
        const newRowContent = newContent[row];
        for (const tile of newRowContent) {
          if (tile !== "") {
            newWord.push(tile);
          } else {
            newWord.push(""); // Add empty tiles for empty cells
          }
        }
      }

      //Check if the word is vertical
      //Update word based on the content of the column
      if (direction === "v") {
        const newColContent = newContent.map((row) => row[col]); // Extract column content
        for (const tile of newColContent) {
          if (tile !== "") {
            newWord.push(tile);
          } else {
            newWord.push(""); // Add empty tiles for empty cells
          }
        }
      }

      setWord(newWord);

      // Log the current word
      console.log("Current word:", newWord.join(""));
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

      // Check if word is horizontal or vertical
      const row = Math.floor(selectedCell / size);
      const col = selectedCell % size;
      const horizontalWord =
        word.length > 1 &&
        row === Math.floor((selectedCell - word.length + 1) / size);
      const verticalWord =
        word.length > 1 &&
        col === Math.floor((selectedCell - word.length * size + size) % size);

      if (horizontalWord) {
        console.log("Horizontal word detected.");
      } else if (verticalWord) {
        console.log("Vertical word detected.");
      } else {
        console.log("Word is neither horizontal nor vertical.");
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
            <Draggable
              key={index}
              x={(index % 7) * 40} // Adjust the spacing as needed
              y={Math.floor(index / 7) * 30} // Adjust the spacing as needed, multiplying by 2 for better spacing
              shouldReverse
              onDragRelease={(event) => handleDrop(event, letter)} // Use onDragRelease for the drop event
            >
              <View style={styles.letter}>
                <Text>{letter}</Text>
              </View>
            </Draggable>
          ))}
        </View>
        <View style={styles.buttons}>
          <Button title="Draw Tile" onPress={drawTile} />
          <Button title="Check Word" onPress={checkWord} />
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
    padding: 10,
    backgroundColor: "#DDDDDD",
    borderRadius: 5,
    borderColor: "black",
  },
  buttons: {
    alignSelf: "flex-end",
    marginTop: "auto", // Push buttons to the bottom
    width: "100%", // Ensure buttons take full width
    alignItems: "center", // Center buttons horizontally
    paddingBottom: 10,
  },
  error: {
    paddingBottom: 20,
  },
});

export default Inventory;
