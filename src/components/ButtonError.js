import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  useDerivedValue, 
} from 'react-native-reanimated';
import useStyles from '../styles/GlobalStyles';

/**
 * ErrorButton Component
 * 
 * A customizable animated button with error styling.
 * 
 * @param {Object} props - Component properties
 * @param {() => void} props.onPress - Function to handle button press
 * @param {string} props.title - Button label text
 * @returns {JSX.Element} The animated error button component
 */
const ErrorButton = ({ onPress, title }) => {
  const { styles, color } = useStyles();
  const buttonScale = useSharedValue(1);

  /**
   * Animated background color transition
   */
  const backgroundColor = useDerivedValue(() => 
    withTiming(color.errorPrimary, { duration: 100 })
  );

  /**
   * Handles button press-in animation
   */
  const onPressIn = () => {
    buttonScale.value = withTiming(0.98, { duration: 100 });
  };

  /**
   * Handles button press-out animation
   */
  const onPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  /**
   * Animated button style
   */
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: backgroundColor.value,
  }));

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.button, animatedButtonStyle]}>
        <Animated.Text style={styles.bottomButtonText}>
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default ErrorButton;
