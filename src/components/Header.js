import React, { useEffect } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useStyles from '../styles/GlobalStyles';

export const heightOfProgressBar = Platform.OS === 'ios' ? 100 : 80;

const ProgressBar = ({ progress, onClose, altIcon, bar, onMenu = () => { } }) => {
  const { styles, color } = useStyles();

  const insets = useSafeAreaInsets();
  const animatedWidth = useSharedValue(10);
  const animatedScale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => ({
    width: `${animatedWidth.value}%`,
    transform: [{ scaleY: animatedScale.value }]
  }));

  useEffect(() => {
    const newProgress = progress;
    const remainingWidth = 90;
    const newWidth = 10 + (newProgress / 100) * remainingWidth;

    animatedWidth.value = withTiming(newWidth, { duration: 500 });

    // Add a bouncing effect
    animatedScale.value = withSequence(
      withTiming(1.05, { duration: 150 }),
      withSpring(1, { damping: 0.2, stiffness: 10, mass: 1.5 })
    );

  }, [progress]);

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOnMenu = () => {
    if (onMenu) {
      onMenu();
    }
  };

  return (
    <>
      <View style={[styles.progressBarContainer, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={handleOnClose} style={styles.iconContainer}>
          {altIcon ?
            <Fontisto style={styles.arrow} name="close-a" size={16} color={color.mutedText} /> :
            <FontAwesome5 style={styles.arrow} size={22} name="chevron-left" color={color.mutedText} />
          }
        </TouchableOpacity>
        {bar ?
          <View style={[styles.backgroundProgressBar]}>
            <Animated.View style={[styles.progressBar, animatedStyles]} />
          </View>
          :
          <View style={[styles.backgroundProgressBar, { opacity: 0 }]}>
            <Animated.View style={[styles.progressBar, animatedStyles]} />
          </View>
        }

        <TouchableOpacity onPress={handleOnMenu} style={[styles.iconContainer, { opacity: altIcon ? 1 : 0, pointerEvents: altIcon ? 'auto' : 'none' }]}>
          <FontAwesome6 style={styles.arrow} size={18} name="sliders" color={color.mutedText} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ProgressBar;
