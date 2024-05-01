import React, { useState } from "react";

const YourComponent = () => {
  const [word, setWord] = useState("");

  const handleLetterPlacement = (letter) => {
    const newWord = word + letter;
    setWord(newWord);
  };

  const uploadWord = () => {
    // Assuming you have an API endpoint to upload the word
    // Replace 'yourApiEndpoint' with your actual API endpoint
    fetch("yourApiEndpoint", {
      method: "POST",
      body: JSON.stringify({ word }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload word");
        }
        // Handle successful upload
        console.log("Word uploaded successfully");
        // Reset the word
        setWord("");
      })
      .catch((error) => {
        console.error("Error uploading word:", error);
        // handle the error in your UI
      });
  };

  return (
    <div>
      {/* Add more buttons for other letters as needed */}
      <button onClick={uploadWord}>Upload Word</button>
    </div>
  );
};

export default YourComponent;
