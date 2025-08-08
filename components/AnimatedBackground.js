// components/AnimatedBackground.js
import React, { useEffect } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const Bubble = ({ size, left, delay }) => {
  const translateY = useSharedValue(height);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-100, {
        duration: 25000,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          width: size,
          height: size,
          left: left,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: size / 2,
        },
        animatedStyle,
      ]}
    />
  );
};

const AnimatedBackground = () => {
  const bubbles = [
    { size: 40, left: width * 0.25, delay: 0 },
    { size: 10, left: width * 0.1, delay: 500 },
    { size: 15, left: width * 0.7, delay: 1000 },
    { size: 30, left: width * 0.4, delay: 0 },
    { size: 10, left: width * 0.65, delay: 0 },
    { size: 55, left: width * 0.75, delay: 300 },
    { size: 70, left: width * 0.35, delay: 700 },
    { size: 12, left: width * 0.5, delay: 1500 },
    { size: 8, left: width * 0.2, delay: 1000 },
    { size: 80, left: width * 0.85, delay: 0 },
  ];

  return bubbles.map((b, i) => <Bubble key={i} {...b} />);
};

export default AnimatedBackground;

const styles = StyleSheet.create({
  bubble: {
    position: "absolute",
    bottom: -100,
  },
});
