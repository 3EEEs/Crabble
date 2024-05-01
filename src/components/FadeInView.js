import React, { useRef, useEffect } from "react";
import { Animated, Text, View, Image } from "react-native";

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const { content } = props; // Extracting the content from props

  return (
    <Animated.View // Special animatable View
      style={{
        opacity: fadeAnim, // Bind opacity to animated value
      }}
    >
      {/* Check if the content is a string */}
      {typeof content === "string" ? (
        // Wrap text content in a Text component
        <Text style={{ fontSize: 28, textAlign: "center", margin: 10 }}>
          {content}
        </Text>
      ) : (
        // Otherwise, render image content
        <Image source={content} style={{ width: 250, height: 250 }} />
      )}
    </Animated.View>
  );
};

export default FadeInView;
