import React, {useEffect} from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';
import useStyles from '../styles/GlobalStyles';
import LoaderKit from 'react-native-loader-kit'

type ButtonProps = {
    onPress: () => void;
    title: string;
    disabled?: boolean;
    loading?: boolean;
  };


/**
 * A button component with a loading animation.
 *
 * @param {object} props Component props
 * @param {function} props.onPress Function to be called when the button is pressed
 * @param {string} props.title The text to display on the button
 * @param {boolean} [props.disabled=false] Whether the button should be disabled
 * @param {boolean} [props.loading=false] Whether the button should display a loading animation
 */

const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  disabled = false,
  loading = false
}) => {
  const { styles, color } = useStyles();
  const buttonScale = useSharedValue(1);
  const isDisabled = useSharedValue(disabled);
  const isLoading = useSharedValue(loading);

  useEffect(() => {
    isDisabled.value = disabled;
    isLoading.value = loading;
  }, [disabled, loading]);

  const onPressIn = () => {
    buttonScale.value = withTiming(0.98, { duration: 100 });
  };

  const onPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    backgroundColor: color.surface
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: color.primary,
    opacity: withTiming(isLoading.value ? 0 : 1),
    transform: [{ scale: withTiming(isLoading.value ? 0 : 1) }],
  }));

  const animatedLoaderStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isLoading.value ? 1 : 0),
    transform: [{ scale: withTiming(isLoading.value ? 1 : 0) }],
  }));

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
    >
      <Animated.View style={[styles.button, animatedButtonStyle]}>
        <Animated.Text style={[styles.text, animatedTextStyle]}>
          {title}
        </Animated.Text>
        <Animated.View style={[StyleSheet.absoluteFill, styles.loaderContainer, animatedLoaderStyle]}>
          <LoaderKit
            style={styles.buttonLoaderIcon}
            name={'BallPulse'}
            color={color.primary}
          />
        </Animated.View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default Button;
