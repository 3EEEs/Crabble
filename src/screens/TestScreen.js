import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ReadFile from "../components/ReadFile";

const TestScreen = () => {
  const [term, setTerm] = useState(""); // Set initial state to 'word'

  const navigation = useNavigation();

  return (
    <View>
      <ReadFile />
    </View>
  );
};
const styles = StyleSheet.create({});

export default TestScreen;
