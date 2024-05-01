import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";

const SearchScreen = () => {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const searchWord = async () => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${term}`,
      );

      if (response.ok) {
        const data = await response.json();

        if (data && data.length > 0) {
          const wordData = data[0];
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
      } else {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage("Error fetching word definition.");
        }
      }
    } catch (error) {
      setErrorMessage("Error fetching word definition.");
    }
  };

  const handleTermSubmit = () => {
    if (term.trim() !== "") {
      searchWord();
    }
  };

  useEffect(() => {
    if (term.trim() !== "") {
      searchWord();
    }
  }, []);

  return (
    <View style={styles.container}>
      <SearchBar
        term={term}
        onTermChange={setTerm}
        onTermSubmit={handleTermSubmit}
      />
      {errorMessage ? <Text>{errorMessage}</Text> : null}
      {definition ? <Text style={styles.definition}>{definition}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  definition: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default SearchScreen;
