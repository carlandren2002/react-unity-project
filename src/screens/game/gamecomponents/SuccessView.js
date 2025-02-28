import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import useStyles from '../../../styles/GlobalStyles';
import ButtonSuccess from '../../../components/ButtonSuccess';

/**
 * Displays an animated bottom sheet indicating a correct answer.
 *
 * @param {SuccessViewProps} props - The props object.
 * @returns {JSX.Element} The rendered success sheet component.
 */
function SuccessView({ visible, lessonIndex, currentObjective, onRetry }) {
  const { styles, color } = useStyles();

  // Create a shared value to control the vertical translation of the sheet
  const translateY = useSharedValue(300);

  // Apply animated style based on translateY value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Slide the sheet in when visible changes to true
  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 250 });
    } else {

    }
  }, [visible, translateY]);

  /**
   * Opens a Google Form for feedback or issue reporting.
   */
  const openForm = async () => {
    const baseUrl =
      'https://docs.google.com/forms/d/e/1FAIpQLSckPU0lwaQwEbXK0jzRxoozDSMsqap-dmyW5g7PpE0havzKOg/viewform';
    const params = new URLSearchParams({
      usp: 'pp_url',
      'entry.1045781291': lessonIndex.toString(),
      'entry.1065046570': currentObjective,
    });
    const url = `${baseUrl}?${params.toString()}`;

    try {
      // Attempt to open the URL in an in-app browser
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(url, {

        });
      } else {
        // Fallback to external browser
        Linking.openURL(url);
      }
    } catch (error) {
      console.error('Failed to open form:', error);
    }
  };

  return (
    <Animated.View style={[styles.bottomSuccessSheet, animatedStyle]}>
      <View style={styles.bottomSuccessSheetContent}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AntDesign style={{ color: color.successPrimary }} name="checkcircle" size={20} />
          <Text style={styles.bottomSuccessSheetTitle}>Korrekt</Text>

          {/* Flag button to open the form */}
          <TouchableOpacity onPress={openForm} style={{ position: 'absolute', right: 8 }}>
            <Ionicons style={{ color: color.successPrimary }} name="flag-outline" size={20} />
          </TouchableOpacity>
        </View>

        {/* Success button to proceed to the next step */}
        <View style={styles.bottomButtonContainer}>
          <ButtonSuccess onPress={onRetry} title="Gå vidare" />
        </View>
      </View>
    </Animated.View>
  );
}

export default SuccessView;