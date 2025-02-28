import React, { useEffect, useContext } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LessonContext } from '../../LessonContext';
import { AuthContext } from '../../AuthContext';
import Button from '../../components/Button';
import useStyles from '../../styles/GlobalStyles';
import { heightOfProgressBar } from '../../components/Header2';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

/**
 * The Finished component is displayed after a user has finished a lesson.
 *
 * The component stores the lesson as completed in the LessonContext
 * and displays a congratulatory message to the user.
 *
 * @param {object} props
 * @param {number} props.lessonIndex - The index of the lesson that was completed.
 * @param {function} props.onGoToTop - Function to navigate back to top.
 * @returns {JSX.Element} The Finished component.
 */
const Finished: React.FC<{ lessonIndex: number; onGoToTop: () => void }> = ({ lessonIndex, onGoToTop }) => {
  const { styles } = useStyles();
  const insets = useSafeAreaInsets();
  const { storeCompletedLesson } = useContext(LessonContext);
  const { user } = useContext(AuthContext);

  // Reanimated Shared Value for opacity
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    if (user) {
      storeCompletedLesson(lessonIndex);
    }

    // Start the animation with a 3-second delay
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Animated style for the button container
  const animatedButtonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <View style={[styles.container, { flex: 1, width: '100%' }]}>
      {/* <Header2 onCogPress={() => navigation.navigate('Settings' as never)} />*/}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingTop: heightOfProgressBar + 50 }}
      >
        <View style={styles.textContainerL}>
          <Text style={styles.massiveTitle}>👏</Text>
          <Text style={styles.titleThinBig}>Bra jobbat!</Text>
        </View>
      </ScrollView>
      <Animated.View
        style={[styles.buttonContainer, { paddingBottom: insets.bottom }, animatedButtonStyle]}
      >
        <Button title="Gå vidare" onPress={onGoToTop} primary />
      </Animated.View>
    </View>
  );
};

export default Finished;
