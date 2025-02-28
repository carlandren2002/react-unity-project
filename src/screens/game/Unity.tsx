// https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks
// @refresh reset
// @ts-nocheck

import UnityView from '@azesmway/react-native-unity';
import React, { useState, useRef, useEffect } from 'react'
import { View, Text, TouchableOpacity, ActionSheetIOS, Platform, StyleSheet } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native'
import LinearGradient from 'react-native-linear-gradient';
import Header, { heightOfProgressBar } from '../../components/Header';
import useStyles from '../../styles/GlobalStyles';
import Quit from './gamecomponents/Quit';
import useProgress from '../../hooks/useProgress';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'; // Import for Android
import Finished from './Finished'; // Import the Finished component

/**
 * The Unity component renders a Unity game view and handles communication with the Unity application.
 * It also renders the Header component with a progress bar and a button to go back to the main tab navigator.
 * If the player completes a level, the component navigates to the Finished screen.
 * @param {{ route: { params: { lesson: Lesson } } }} props
 * @returns {JSX.Element} The Unity component.
 */
const Unity: React.FC<{ route: any }> = ({ route }) => {
  const { styles, color } = useStyles();
  const { lesson } = route.params;
  const unityRef = useRef<UnityView>(null);
  const navigation = useNavigation<NavigationProp<any>>();

  // ========================
  // FINISH LEVEL
  // ========================
  const [finishedVisible, setFinishedVisible] = useState(false);

  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (finishedVisible) {
      animationProgress.value = withTiming(1, { duration: 300 });
    } else {
      animationProgress.value = 0;
    }
  }, [finishedVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [0.9, 1]);
    const opacity = animationProgress.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });
  
  // ========================
  // QUIT
  // ========================
  const [overlayVisible, setOverlayVisible] = useState(false);
  const showOverlay = () => setOverlayVisible(true);
  const hideOverlay = () => setOverlayVisible(false);
  const confirmNavigation = () => {
    hideOverlay();
    try {
      if (unityRef.current) {
        unityRef.current.unloadUnity();
      }
      navigation.navigate('TabNavigator');
    } catch (error) {
      console.error('Error navigating to Main:', error);
    }
  };

  // ========================
  // DISPLAY PROGRESS
  // ========================
  const { progress, setProgress } = useProgress();

  // ========================
  // UNITY COMMUNICATION
  // ========================
  const handleUnityMessage = (result: any) => {

    console.log(result.nativeEvent.message);

    if (result.nativeEvent.message.startsWith('LevelCompleted')) {
      setTimeout(() => {
        setProgress(100);
        finishLevel();
      }, 3000);
    }
    if (result.nativeEvent.message === 'Tap Start') {
      ReactNativeHapticFeedback.trigger("impactLight");
    } else if (result.nativeEvent.message === 'Tap End') {
      ReactNativeHapticFeedback.trigger("impactLight");
    }
    if (result.nativeEvent.message === 'Scene') {
      if (lesson) {
        unityRef.current?.postMessage('SceneLoader', 'LoadScene', lesson.scene);
      } else {
        unityRef.current?.postMessage('SceneLoader', 'LoadScene', 'Lektion1');
      }
    }
  };

  // ========================
  // ACTION SHEET (For Android)
  // ========================
  const actionSheetRef = useRef<ActionSheetRef>(null);

  const showAndroidActionSheet = () => {
    actionSheetRef.current?.show();
  };

  // ========================
  // NATIVE ACTION SHEET (For iOS)
  // ========================
  const showIOSActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Rapportera fel'],
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1, // Mark the second button as destructive if needed
      },
      (buttonIndex) => {
        // Handle the button press based on index
        if (buttonIndex === 1) {
          console.log('Option 1 selected');
        } else if (buttonIndex === 2) {
          console.log('Option 2 selected');
        } else if (buttonIndex === 3) {
          console.log('Option 3 selected');
        }
      }
    );
  };

  // Show Action Sheet depending on the platform
  const showActionSheet = () => {
    if (Platform.OS === 'ios') {
      showIOSActionSheet();
    } else {
      showAndroidActionSheet();
    }
  };

  // Additional styles for the animated Finished component
  const additionalStyles = StyleSheet.create({
    finishedContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: color.background,
      zIndex:1000,
    },
  });

  return (
    <View style={[styles.containerGameView]}>
      <Header
        progress={progress}
        onClose={showOverlay}
        onMenu={showActionSheet} // Trigger the correct action sheet based on platform
        altIcon
        bar
      />
      <LinearGradient
        colors={[color.background, color.bgTransparent]}
        style={[styles.topGradientGameView, { top: heightOfProgressBar }]}
      />
      <UnityView
        ref={unityRef}
        androidKeepPlayerMounted={false}
        style={styles.unityView}
        onUnityMessage={handleUnityMessage}
      />
      <Quit visible={overlayVisible} onClose={hideOverlay} onConfirm={confirmNavigation} />

      {/* Finished Component with Animation */}
      {finishedVisible && (
        <Animated.View style={[additionalStyles.finishedContainer, animatedStyle]}>
          <Finished lessonIndex={lesson.lessonIndex} onGoToTop={confirmNavigation} />
        </Animated.View>
      )}

      {/* Action Sheet for Android */}
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
};

export default Unity;