import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
// Animated library for smooth transitions.
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
// Icon libraries
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// In-App Browser for opening links within the app context.
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
// Styles and custom components.
import useStyles from '../../../styles/GlobalStyles';
import ButtonError from '../../../components/ButtonError';

/**
 * Displays an animated bottom sheet when an incorrect answer is given.
 * 
 * @param {Props} props - The props object.
 * @returns {JSX.Element} The rendered error sheet component.
 */
export default function ErrorView({ 
  visible, 
  lessonIndex, 
  currentObjective, 
  onRetry 
}) {
  // Retrieve global styles and theme colors
  const { styles, color } = useStyles();

  // useSharedValue for controlling vertical translation of the sheet
  const translateY = useSharedValue(300);

  /**
   * Dynamic style hook to apply the animated translateY
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  /**
   * useEffect to trigger the bottom sheet to slide up when it becomes visible.
   */
  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 250 });
    }
  }, [visible, translateY]);

  /**
   * openForm
   * 
   * Opens a Google Form in the in-app browser (or fallback to external browser)
   * to flag the incorrect question. Populates the form with the current
   * lesson index and objective for easier reporting.
   */
  const openForm = async () => {
    // Base Google Form URL
    const baseUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSckPU0lwaQwEbXK0jzRxoozDSMsqap-dmyW5g7PpE0havzKOg/viewform';

    // Setup query parameters for pre-populated form fields
    const params = new URLSearchParams({
      usp: 'pp_url',
      'entry.1045781291': lessonIndex.toString(),
      'entry.1065046570': currentObjective,
    });

    // Construct the final URL
    const url = `${baseUrl}?${params.toString()}`;

    try {
      // Check if InAppBrowser is available and open the URL
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {

        });
      } else {
        // Fallback to the default device browser
        Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening form:', error);
    }
  };

  return (
    /**
     * Animated container view that slides in from the bottom
     * when "visible" is true.
     */
    <Animated.View style={[styles.bottomErrorSheet, animatedStyle]}>
      <View style={styles.bottomErrorSheetContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Icon indicating an error */}
          <AntDesign style={{ color: color.errorPrimary }} name="closecircle" size={20} />
          
          {/* Title of the error sheet */}
          <Text style={styles.bottomErrorSheetTitle}>Inkorrekt</Text>

          {/* Flag button to report the issue */}
          <TouchableOpacity
            onPress={openForm}
            style={{ position: 'absolute', right: 8 }}
          >
            <Ionicons style={{ color: color.errorPrimary }} name="flag-outline" size={20} />
          </TouchableOpacity>
        </View>

        {/* Button to allow users to retry the question */}
        <View style={styles.bottomButtonContainer}>
          <ButtonError onPress={onRetry} title="Gå vidare" />
        </View>
      </View>
    </Animated.View>
  );
}
