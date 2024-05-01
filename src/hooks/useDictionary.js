import { useState, useEffect } from "react";
import getWordDefinition from "../api/getWordDefinition";

const useDictionary = (word) => {
  const [isWordInDictionary, setIsWordInDictionary] = useState(null);

  useEffect(() => {
    const checkDictionary = async () => {
      try {
        const response = await getWordDefinition(word);
        // If the API call succeeds without throwing an error, the word is in the dictionary
        setIsWordInDictionary(true);
      } catch (error) {
        // If the API call fails with an error, the word is not in the dictionary
        setIsWordInDictionary(false);
      }
    };

    checkDictionary();
  }, [word]);

  return isWordInDictionary;
};

export default useDictionary;
