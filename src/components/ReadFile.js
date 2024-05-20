import React, { useState } from "react";
import { FileSystem } from "expo-file-system";
import { View, Button, Text } from "react-native";

const ReadFile = () => {
  const [fileContent, setFileContent] = useState("");

  const readFile = async () => {
    // Use Expo's asset system to get the URI of the file
    const fileUri = FileSystem.documentDirectory + "tilebag.txt";

    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists && fileInfo.isReadable) {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        setFileContent(fileContent);
      } else {
        console.log("File does not exist or is not readable.");
      }
    } catch (error) {
      console.log("Error reading file:", error);
    }
  };

  return (
    <View>
      <Text>Read File</Text>
      <Button title="Read File" onPress={readFile} />
      <Text>{fileContent}</Text>
    </View>
  );
};

export default ReadFile;
