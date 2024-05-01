import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import FadeInView from "../components/FadeInView";

const MenuScreen = () => {
  const [term, setTerm] = useState(""); // Set initial state to 'word'

  const navigation = useNavigation();

  return (
    <View style={styles.background}>
      <Text style={styles.title}>Menu</Text>
      <FadeInView
        style={[styles.crab]}
        content={require("../../assets/crab.png")}
      />
      <View style={styles.shadowProp}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Game")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Search", { word: term })}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>

          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={require("../../assets/slice1.png")}
            />
            <Image
              style={styles.image}
              source={require("../../assets/slice2.png")}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: "azure",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
  },
  background: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    height: 400,
    width: "90%",
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 50,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "coral",
    padding: 20,
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 50,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    marginTop: 120,
  },
  crab: {
    width: 10,
    height: 10,
    alignSelf: "center",
  },
});

export default MenuScreen;
