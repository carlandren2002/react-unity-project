import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import useStyles from '../../styles/GlobalStyles';

/**
 * @function Explanation
 * @description Displays an explanation with a fade-in animation when the answer is revealed.
 * @param {Object} props - Component props
 * @param {boolean} props.answerRevealed - Controls whether the explanation should be shown
 * @param {string} props.explanation - The explanation text to display
 * @returns {JSX.Element|null} The rendered Explanation component or null if not revealed
 */
function Explanation({ answerRevealed, explanation }) {
  const [animatedOpacity] = useState(new Animated.Value(0)); // Initial opacity
  const { styles, color } = useStyles();

  useEffect(() => {
    if (answerRevealed) {
      Animated.timing(animatedOpacity, {
        toValue: 1, // Fade in fully
        duration: 500, // Duration of the fade-in animation
        useNativeDriver: true,
      }).start();
    }
  }, [answerRevealed, animatedOpacity]);

  // Do not render anything if the answer has not been revealed
  if (!answerRevealed) return null;

  return (
    <>
      <Animated.View
        style={[
          styles.explanationContainer,
          { opacity: animatedOpacity },
        ]}
      >
        <View style={styles.explanationTitleContainer}>
          <View style={styles.explanationTitleParent}>
            <Text style={styles.explanationTitle}>Förklaring</Text>
          </View>
        </View>
        <Text style={styles.explanationText}>{explanation}</Text>
      </Animated.View>
      {/* Spacing View (used for layout purposes) */}
      <View style={{ height: 190, width: 500 }} />
    </>
  );
}

export default Explanation;