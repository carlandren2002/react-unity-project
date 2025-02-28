import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
  Platform,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header, { heightOfProgressBar } from '../../components/Header';
import useStyles from '../../styles/GlobalStyles';
import Quit from '../game/gamecomponents/Quit';
import ActionSheet from 'react-native-actions-sheet';
import Finished from '../game/Finished';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import RenderQuiz from './RenderQuiz';
import { useQuiz } from '../../QuizContext';

/**
 * @function Quiz
 * @description Main Quiz Component
 * @param {object} props - Component props
 * @param {object} props.route - Navigation route object containing parameters
 * @param {object} props.route.params - Object containing lesson details
 * @param {object} props.route.params.lesson - Lesson object
 * @param {number} props.route.params.lesson.lessonIndex - Index of the current lesson
 * @param {string[]} props.route.params.lesson.questionIds - Array of question IDs for the quiz
 * @returns {JSX.Element} The rendered component
 */
function Quiz({ route }) {
  const { styles, color } = useStyles();
  const { lesson } = route.params;
  const navigation = useNavigation();

  // ========================
  // QUIZ STATES
  // ========================
  const { finished, setFinished, progress, setProgress } = useQuiz();

  // ========================
  // FINISH ANIMATION
  // ========================
  const finishAnimationProgress = useSharedValue(0);

  /**
   * Reset quiz progress on mount
   */
  useEffect(() => {
    setProgress(0);
  }, [setProgress]);

  /**
   * Trigger animation when quiz is finished
   */
  useEffect(() => {
    finishAnimationProgress.value = finished
      ? withTiming(1, { duration: 300 })
      : 0;
  }, [finished, finishAnimationProgress]);

  /**
   * Define the animated style for the finished overlay
   */
  const finishAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(finishAnimationProgress.value, [0, 1], [0.9, 1]);
    const opacity = finishAnimationProgress.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // ========================
  // QUIT OVERLAY
  // ========================
  const [overlayVisible, setOverlayVisible] = useState(false);

  /**
   * Show the quit overlay
   */
  const showOverlay = () => setOverlayVisible(true);

  /**
   * Hide the quit overlay
   */
  const hideOverlay = () => setOverlayVisible(false);

  /**
   * Navigate away from quiz (quit) and reset finished state
   */
  const confirmNavigation = () => {
    setFinished(false);
    hideOverlay();
    try {
      navigation.navigate('TabNavigator');
    } catch (error) {
      console.error('Error navigating to Main:', error);
    }
  };

  // ========================
  // ACTION SHEET (For Android)
  // ========================
  const actionSheetRef = useRef(null);

  /**
   * Show custom Android action sheet
   */
  const showAndroidActionSheet = () => {
    actionSheetRef.current?.show();
  };

  // ========================
  // NATIVE ACTION SHEET (For iOS)
  // ========================
  /**
   * Show native iOS action sheet
   */
  const showIOSActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Rapportera fel'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          console.log('User chose "Rapportera fel"');
        }
      }
    );
  };

  /**
   * Conditionally show the correct action sheet based on platform
   */
  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      showIOSActionSheet();
    } else {
      showAndroidActionSheet();
    }
  };

  /**
   * Additional styles for the animated "Finished" component
   */
  const additionalStyles = StyleSheet.create({
    finishedContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: color.background,
      zIndex: 1000,
    },
  });

  return (
    <View style={[styles.containerGameView]}>
      {/* Header with progress bar, close (quit) button, and menu (action sheet) */}
      <Header
        progress={progress}
        onClose={showOverlay}
        onMenu={showActionSheet}
        altIcon
        bar
      />

      {/* Quit overlay (Confirm leaving the quiz) */}
      <Quit
        visible={overlayVisible}
        onClose={hideOverlay}
        onConfirm={confirmNavigation}
      />

      {/* Quiz content */}
      <View style={{ flex: 1, paddingTop: heightOfProgressBar }}>
        <RenderQuiz questionIds={lesson.questionIds} />
      </View>

      {/* Animated "Finished" overlay when quiz is complete */}
      {finished && (
        <Animated.View
          style={[additionalStyles.finishedContainer, finishAnimatedStyle]}
        >
          <Finished
            lessonIndex={lesson.lessonIndex}
            onGoToTop={confirmNavigation}
          />
        </Animated.View>
      )}

      {/* ActionSheet for Android */}
      <ActionSheet ref={actionSheetRef}>
        <View style={{ padding: 20 }}>
          <TouchableOpacity onPress={() => console.log('Option 1')}>
            <Text style={{ fontSize: 18 }}>Option 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Option 2')}>
            <Text style={{ fontSize: 18, marginTop: 15 }}>Option 2</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => console.log('Option 3')}>
            <Text style={{ fontSize: 18, marginTop: 15 }}>Option 3</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
}

export default Quiz;
