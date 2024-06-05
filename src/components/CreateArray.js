import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CreateArray = (size, param) => {
  // console.log("param: " + param);
  // console.log("size: " + size);

  // Initialize the 2D array
  const array = [];
  if (param === "") {
    counter = 0;
  } else {
    counter = param;
  }

  // Loop over rows
  for (let i = 0; i < size; i++) {
    // Initialize the row
    array[i] = [];

    // Loop over columns
    for (let j = 0; j < size; j++) {
      // Fill in the value and increment the counter
      if (param === "") {
        array[i][j] = "";
      } else {
        array[i][j] = counter;
      }
      counter++;
    }
  }

  return array;
};

const styles = StyleSheet.create({});

export default CreateArray;
