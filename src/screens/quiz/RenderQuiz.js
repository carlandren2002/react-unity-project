import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import useStyles from '../../styles/GlobalStyles';
import useSound from '../../hooks/useSound';
import ErrorView from '../game/gamecomponents/ErrorView';
import SuccessView from '../game/gamecomponents/SuccessView';
import Explanation from './Explaination';
import { useQuiz } from '../../QuizContext';

const questionsData = require('../../questions/questions.json'); // Import questions.json

/**
 * Extracts the quiz data from the provided questions JSON based on an array of question IDs.
 *
 * @param {number[]} ids - The IDs of the questions to retrieve.
 * @param {object} data - The questions.json data object.
 * @returns {object[]} - An array of question objects matching the given IDs.
 */
function getQuizData(ids, data) {
  const allQuestions = Object.values(data.categories).flat(); // Flatten all category arrays
  return allQuestions.filter((question) => ids.includes(question.id)); // Filter by IDs
}

/**
 * Renders a single question screen with multiple-choice answers.
 *
 * @param {object} props - The component props.
 * @param {object} props.route - The route object containing screen parameters.
 * @param {object} props.navigation - The navigation object for screen transitions.
 * @returns {JSX.Element} - A React component that displays the quiz question screen.
 */
function QuestionScreen({ route, navigation }) {
  const { playSuccess, playFail, playInfo } = useSound();
  const { setFinished, setProgress } = useQuiz();
  const scrollViewRef = useRef(null);

  // Retrieve question IDs passed from route params
  const questionIds = route.params?.questionIds;

  // Obtain quiz data for the relevant question IDs
  const quizData = getQuizData(questionIds, questionsData);

  const questionIndex = route.params?.questionIndex ?? 0;
  const remainingQuestions =
    route.params?.remainingQuestions ??
    quizData.map((_, index) => index);

  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const { styles } = useStyles();

  const currentQuestion = quizData[questionIndex];
  const { question, alternatives, correct_index } = currentQuestion;

  /**
   * Handles answer selection. Plays sound effects and shows success/error view.
   *
   * @param {number} index - The index of the selected alternative.
   */
  const handleSelectAnswer = (index) => {
    if (answerRevealed) return;

    setSelectedAnswerIndex(index);
    setAnswerRevealed(true);

    if (index === correct_index) {
      // Update progress for correct answer
      playSuccess();
      const progress =
        ((quizData.length - remainingQuestions.length + 1) /
          quizData.length) *
        100;
      setProgress(progress);
      setSuccessVisible(true);
    } else {
      // Wrong answer
      playInfo();
      setErrorVisible(true);
    }
  };

  /**
   * Proceeds to the next question. If the answer was incorrect, the question is appended again to the queue.
   */
  const handleNextQuestion = () => {
    setErrorVisible(false);
    const wasCorrect = selectedAnswerIndex === correct_index;
    let updatedRemainingQuestions = remainingQuestions;

    // If answered wrong, re-queue the current question
    if (!wasCorrect) {
      updatedRemainingQuestions = [
        ...remainingQuestions,
        questionIndex,
      ];
    }

    updatedRemainingQuestions = updatedRemainingQuestions.slice(1);

    if (updatedRemainingQuestions && updatedRemainingQuestions.length > 0) {
      navigation.push('Question', {
        questionIndex: updatedRemainingQuestions[0],
        scoreSoFar:
          (route.params?.scoreSoFar ?? 0) + (wasCorrect ? 1 : 0),
        remainingQuestions: updatedRemainingQuestions,
        setFinished: route.params?.setFinished, // Pass setFinished to the next screen
      });
    } else {
      // No more questions left
      setFinished(true); // Update the global state
    }
  };

  useEffect(() => {
    // Scroll to the end to show Explanation after answer is revealed
    if (answerRevealed && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [answerRevealed]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollView]}
        contentContainerStyle={[styles.containerQuiz, { paddingVertical: 30 }]}
      >
        <Text style={styles.questionText}>{question}</Text>
        {alternatives.map((alt, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.altButton,
              selectedAnswerIndex !== null && {
                backgroundColor:
                  selectedAnswerIndex === index ? '#BBC9FF' : '#E7E7E7',
                borderColor:
                  selectedAnswerIndex === index ? '#8FA6FD' : 'transparent',
              },
            ]}
            onPress={() => handleSelectAnswer(index)}
          >
            <Text
              style={[
                styles.altText,
                selectedAnswerIndex !== null && {
                  color:
                    selectedAnswerIndex === index ? '#2248FD' : '#545454',
                },
              ]}
            >
              {alt}
            </Text>
          </TouchableOpacity>
        ))}
        {answerRevealed && (
          <Explanation
            answerRevealed={answerRevealed}
            explanation={currentQuestion.explanation}
          />
        )}
      </ScrollView>

      <SuccessView
        visible={successVisible}
        lessonIndex={1}
        currentObjective="Sample Objective"
        onRetry={handleNextQuestion}
        correctIs={`Svar: ${alternatives[correct_index]}`}
      />

      <ErrorView
        visible={errorVisible}
        lessonIndex={1}
        currentObjective="Sample Objective"
        onRetry={handleNextQuestion}
        correctIs={`Svar: ${alternatives[correct_index]}`}
      />
    </View>
  );
}

// Create the stack navigator
const Stack = createStackNavigator();

/**
 * Renders the quiz by providing a navigation container with the Question screen.
 *
 * @param {object} props - The component props.
 * @param {number[]} props.questionIds - The question IDs to be displayed in the quiz.
 * @returns {JSX.Element} - A React component containing the quiz stack navigator.
 */
export default function RenderQuiz({ questionIds }) {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          cardStyleInterpolator: customCardStyleInterpolator,
          transitionSpec: slowTransitionSpec,
          cardOverlayEnabled: true,
          headerShown: false,
          cardShadowEnabled: false,
          cardStyle: {
            shadowColor: 'transparent',
            elevation: 0,
            backgroundColor: 'transparent',
            shadowOpacity: 0,
          },
        }}
      >
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          initialParams={{ questionIds }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Custom card style interpolator for screen transitions.
 *
 * @param {object} props - The props object containing transition data.
 * @param {object} props.current - The current transition state.
 * @param {object} [props.next] - The next transition state (if any).
 * @param {object} props.layouts - Screen layout information.
 * @returns {object} An object with card and overlay style transformations.
 */
const customCardStyleInterpolator = ({ current, next, layouts }) => {
  const progress = next
    ? Animated.add(current.progress, next.progress)
    : current.progress;

  return {
    cardStyle: {
      transform: [
        {
          translateX: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width, 0],
          }),
        },
      ],
    },
    overlayStyle: {
      backgroundColor: '#f3f3f3',
      opacity: progress.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, 0, 1],
      }),
    },
  };
};

/**
 * Transition config for slower animations.
 */
const slowTransitionSpec = {
  open: {
    animation: 'timing',
    config: {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    },
  },
  close: {
    animation: 'timing',
    config: {
      duration: 250,
      easing: Easing.inOut(Easing.ease),
    },
  },
};
