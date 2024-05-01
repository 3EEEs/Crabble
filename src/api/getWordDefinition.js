import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.dictionaryapi.dev/api/v2/entries/en/",
});

const getWordDefinition = async (word) => {
  if (!word) {
    throw new Error("Word is required");
  }

  const url = `${instance.defaults.baseURL}${word}`;
  console.log(`Making request to: ${url}`);

  try {
    const response = await instance.get(word);
    return response.data;
  } catch (error) {
    console.error("Error fetching word definition:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    throw error;
  }
};

export default getWordDefinition;