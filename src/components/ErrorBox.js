import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import useStyles from '../styles/GlobalStyles';

const ErrorBox = ({ error }) => {
  const { styles } = useStyles();

  const translateY = useSharedValue(20); // Initially off-screen
  const opacity = useSharedValue(0); // Initially invisible

  useEffect(() => {
    if (error) {
      // Animate the box to slide up and fade in
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 500 });
    } else {
      // Animate the box to slide down and fade out
      translateY.value = withSpring(20, { damping: 15, stiffness: 100 });
      opacity.value = withTiming(0, { duration: 500 });
    }
  }, [error]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.errorBox, animatedStyle]}>
      <Text style={styles.errorMessage}>{error}</Text>
    </Animated.View>
  );
};


export default ErrorBox;
