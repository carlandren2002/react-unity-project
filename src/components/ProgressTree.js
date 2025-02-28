import React, { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Alert } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  useDerivedValue,
  useAnimatedStyle,
  withRepeat,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import useStyles from '../styles/GlobalStyles';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const { width } = Dimensions.get('window');
const heightOfCircle = ((width * 0.8) / 3 - 20) * 0.9; // 10% smaller

/**
 * Component that renders a snaking path to connect lesson nodes
 * 
 * @param {Object} props - Component props
 * @param {Array} props.lessons - Array of lessons in the chapter
 * @param {number} props.chapterHeight - Height of the chapter container
 * @param {Array} props.completedLessons - Array of completed lesson indices
 * @returns {React.Component} Animated SVG path component
 */
const SnakingPath = React.memo(({ lessons, chapterHeight, completedLessons }) => {
  const { styles, color } = useStyles();

  const localCompletedLessons = useMemo(() => 
    lessons.filter(lesson => completedLessons.includes(lesson.lessonIndex))
      .map(lesson => lesson.lessonIndex), 
    [completedLessons, lessons]
  );
  
  // Simple array for testing      []   1   2   3     4    5    6     7      
  const animatedCompletionValues = [0, 60, 85, 110, 140, 170, 200, 260, 300];

  /**
   * Calculates the SVG path data based on lessons
   */
  const pathData = useMemo(() => {
    const data = [];
    let isMovingRight = true;

    lessons.forEach((lesson, index) => {
      let x, y;
      if (index === 0) {
        x = width * 0.4;
        y = chapterHeight - heightOfCircle / 2;
        data.push(`M ${x} ${y}`);
        x = width * 0.8 - heightOfCircle / 2 * 1.33;
        data.push(`H ${x}`);
        y = chapterHeight - (heightOfCircle * 1.75) - heightOfCircle / 2;
        data.push(`V ${y}`);
      } else {
        const row = Math.floor((index - 1) / 3) + 1;
        const col = (index - 1) % 3;

        // Check if this is the last row
        const isLastRow = row === Math.ceil((lessons.length - 1) / 3);

        if (row % 2 === 1) {
          x = heightOfCircle / 2 * 1.4;
        } else {
          x = width * 0.8 - heightOfCircle / 2 * 1.33;
        }

        y = chapterHeight - row * (heightOfCircle * 1.75) - heightOfCircle / 2;

        if (index > 1 && col === 0) {
          const sideX = row % 2 === 1 ? width * 0.5 - heightOfCircle / 2 : heightOfCircle / 2 * 1.33;
          data.push(`V ${y} H ${sideX}`);
        }

        // If it's the last lesson and in the last row, stop in the middle
        if (isLastRow && index === lessons.length - 1) {
          x = width * 0.4; // Middle of the path
        }

        data.push(`L ${x} ${y}`);
      }

      if (index > 0 && (index - 1) % 3 === 2) {
        isMovingRight = !isMovingRight;
      }
    });

    return data.join(' ');
  }, [lessons, chapterHeight]);

  // Use a shared value to track the current completion progress
  const animatedProgress = useSharedValue(localCompletedLessons.length);

  // Update the progress when completedLessons changes
  useEffect(() => {
    animatedProgress.value = withTiming(localCompletedLessons.length, {
      duration: 1000,
    });
  }, [localCompletedLessons]);

  // Derive the animated completion value
  const animatedCompletion = useDerivedValue(() => {
    return interpolate(
      animatedProgress.value,
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      animatedCompletionValues,
      'clamp'
    );
  });

  const animatedProps = useAnimatedProps(() => ({
    strokeDasharray: `${animatedCompletion.value}% 1000%`,
  }));

  return (
    <Svg height={chapterHeight} width={width * 0.8} style={{ zIndex: -1 }}>
      {/* Original path */}
      <Path
        d={pathData}
        stroke={color.surface}
        strokeWidth="50"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Progress path */}
      <AnimatedPath
        animatedProps={animatedProps}
        d={pathData}
        stroke={color.primary}
        strokeWidth="50"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
});

/**
 * Component that renders an individual lesson node
 * 
 * @param {Object} props - Component props
 * @param {Object} props.lesson - Lesson data
 * @param {number} props.index - Index of the lesson in the chapter
 * @param {number} props.totalLessons - Total number of lessons in the chapter
 * @param {number} props.chapterIndex - Index of the chapter
 * @param {boolean} props.isCompleted - Whether the lesson is completed
 * @param {boolean} props.isLowestUncompleted - Whether this is the next lesson to complete
 * @param {React.RefObject} props.lowestUncompletedRef - Ref to scroll to this lesson if it's the next uncompleted
 * @returns {React.Component} Lesson node component
 */
const Lesson = React.memo(({ 
  lesson, 
  index, 
  totalLessons, 
  chapterIndex, 
  isCompleted, 
  isLowestUncompleted, 
  lowestUncompletedRef 
}) => {
  const { color } = useStyles();
  const animationSize = useSharedValue(110);
  const scale = useSharedValue(1);
  const navigation = useNavigation();

  let lessonPressing = false;

  /**
   * Handles the press-in event for the lesson button
   */
  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  /**
   * Handles the press-out event for the lesson button
   */
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  /**
   * Handles the press event for the lesson button
   * @param {Object} lesson - The lesson data object
   */
  const handleLessonPress = (lesson) => {
    if (lessonPressing) {
      return;
    }

    lessonPressing = true;
    const lessonIndex = lesson.lessonIndex;

    // Check if the lesson is already completed
    if (isCompleted) {
      Alert.alert(
        'Lesson Completed',
        'This lesson is already completed. Do you want to repeat this lesson?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              lessonPressing = false;
            },
            style: 'cancel',
          },
          {
            text: 'Repeat',
            onPress: () => {
              proceedToLesson(lesson);
            },
          },
        ],
        { cancelable: false }
      );
    } else if (!isLowestUncompleted) {
      // If not the lowest uncompleted index, show a warning
      Alert.alert(
        'Skip Lesson?',
        'You are trying to skip ahead to a lesson. Are you sure you want to skip to this lesson?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              lessonPressing = false;
            },
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: () => {
              proceedToLesson(lesson);
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // If it's the lowest uncompleted index, just proceed
      proceedToLesson(lesson);
    }
  };

  /**
   * Helper function to handle proceeding to the lesson
   * @param {Object} lesson - The lesson object from chapter.json
   */
  const proceedToLesson = (lesson) => {
    if (lesson.type === 'unity') {
      goToUnity(lesson);
    } else if (lesson.type === 'quiz') {
      goToQuiz(lesson);
    } else if (lesson.type === 'test') {
      goToTest(lesson);
    } else if (lesson.type === 'text') {
      goToText(lesson);
    }

    setTimeout(() => {
      lessonPressing = false;
    }, 1000);
  };

  /**
   * Navigate to the Quiz screen
   * @param {Object} lesson - The lesson object
   */
  const goToQuiz = (lesson) => {
    const pushAction = StackActions.push('Quiz', { lesson });
    navigation.dispatch(pushAction);
  };

  /**
   * Navigate to the Unity screen
   * @param {Object} lesson - The lesson object
   */
  const goToUnity = (lesson) => {
    const pushAction = StackActions.push('Unity', { lesson });
    navigation.dispatch(pushAction);
  };

  /**
   * Navigate to the Test screen
   * @param {Object} lesson - The lesson object
   */
  const goToTest = (lesson) => {
    const pushAction = StackActions.push('Test', { lesson });
    navigation.dispatch(pushAction);
  };

  /**
   * Navigate to the ChapterReader screen
   * @param {Object} lesson - The lesson object
   */
  const goToText = (lesson) => {
    const pushAction = StackActions.push('ChapterReader', { lesson });
    navigation.dispatch(pushAction);
  };

  /**
   * Calculate the row and column position for the lesson
   */
  const { row, colPosition } = useMemo(() => {
    const isFirstLesson = index === 0;
    const isLastLesson = index === totalLessons - 1;
    let row, col, colPosition;

    if (isFirstLesson) {
      row = 0;
      colPosition = 1;
    } else {
      row = Math.floor((index - 1) / 3) + 1;
      col = (index - 1) % 3;
      colPosition = row % 2 === 0 ? col : 2 - col;
    }

    if (isLastLesson && (index - 1) % 3 !== 2) {
      colPosition = 1;
    }

    return { row, colPosition };
  }, [index, totalLessons]);

  // Set up animation for the lowest uncompleted lesson
  useEffect(() => {
    if (isLowestUncompleted) {
      animationSize.value = withRepeat(
        withTiming(115, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1, // Repeat infinitely
        true // Reverse the animation
      );
    } else {
      animationSize.value = withTiming(110);
    }
  }, [isLowestUncompleted]);

  // Animated style for the pulsing background
  const animatedStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: color.primary,
      borderRadius: 26,
      zIndex: -1,
      transform: [
        { scale: 1.1 + (animationSize.value - 110) / 100 },
      ],
    };
  });

  // Animated style for the lesson button
  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: isCompleted ? color.primary : color.surface,
      borderRadius: 26,
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => handleLessonPress(lesson)}
      ref={isLowestUncompleted ? lowestUncompletedRef : null}
      style={[
        styles.lesson,
        {
          position: 'absolute',
          bottom: row * (styles.lesson.height * 1.75),
          left: colPosition * (styles.container.width * 0.8 / 3),
          zIndex: 1,
        },
      ]}
    >
      <Animated.View style={animatedViewStyle}>
        {!isCompleted && !isLowestUncompleted && <FontAwesome5 name="lock" size={22} color={color.disabled2} />}
        {isLowestUncompleted && <FontAwesome5 name="chevron-right" size={22} color={color.primary} />}
        {isCompleted && <FontAwesome5 name="check" size={22} color={color.surface} />}
      </Animated.View>
      {isLowestUncompleted &&
        <Animated.View style={animatedStyle} />
      }
    </TouchableOpacity>
  );
});

/**
 * Component that renders a full chapter with its lessons
 * 
 * @param {Object} props - Component props
 * @param {Object} props.chapter - Chapter data
 * @param {number} props.chapterIndex - Index of the chapter
 * @param {Array} props.completedLessons - Array of completed lesson indices
 * @param {number} props.lowestUncompletedLessonId - ID of the next lesson to complete
 * @param {React.RefObject} props.lowestUncompletedRef - Ref to scroll to the next uncompleted lesson
 * @returns {React.Component} Chapter component
 */
const Chapter = React.memo(({ 
  chapter, 
  chapterIndex, 
  completedLessons, 
  lowestUncompletedLessonId, 
  lowestUncompletedRef 
}) => {
  const { color } = useStyles();
  
  // Calculate the height of the chapter based on the number of lessons
  const chapterHeight = useMemo(() => {
    return (Math.ceil((chapter.lessonData.length - 1) / 3) + 1) * (heightOfCircle * 1.75) * 0.9;
  }, [chapter.lessonData.length]);

  return (
    <View style={[styles.chapter, { height: chapterHeight }]}>
      <SnakingPath 
        lessons={chapter.lessonData} 
        chapterHeight={chapterHeight} 
        completedLessons={completedLessons} 
      />
      {chapter.lessonData.map((lesson, index) => (
        <Lesson
          key={lesson.lessonIndex}
          lesson={lesson}
          index={index}
          totalLessons={chapter.lessonData.length}
          chapterIndex={chapterIndex}
          isCompleted={completedLessons && completedLessons.includes(lesson.lessonIndex)}
          isLowestUncompleted={
            completedLessons.length === 0
              ? lesson.lessonIndex === 0
              : lesson.lessonIndex === lowestUncompletedLessonId
          }
          lowestUncompletedRef={lowestUncompletedRef}
        />
      ))}
      <View style={styles.chapterTitleContainer}>
        <FontAwesome6 
          solid={true} 
          name="circle-up" 
          size={25} 
          color={color.border} 
          style={styles.chapterIcon} 
        />
        <Text style={[styles.chapterTitle, { color: color.mutedText }]}>
          {chapter.subTitle}
        </Text>
        <Text style={[styles.chapterSubTitle, { color: color.mutedText }]}>
          {chapter.title}
        </Text>
      </View>
    </View>
  );
});

/**
 * Main component that renders the entire progress tree
 * 
 * @param {Object} props - Component props
 * @param {Array} props.chapterData - Array of chapter data
 * @param {Array} props.completedLessons - Array of completed lesson indices
 * @returns {React.Component} ProgressTree component
 */
const ProgressTree = ({ chapterData, completedLessons }) => {
  const { color } = useStyles();
  const scrollViewRef = useRef(null);
  const lowestUncompletedRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useSharedValue(1);
  const mountedRef = useRef(false);
  
  // Add a new ref to track hot reloads
  const hotReloadCountRef = useRef(0);

  /**
   * Calculate the ID of the next lesson to complete
   */
  const lowestUncompletedLessonId = useMemo(() => {
    if (completedLessons.length === 0) return 1;
    const maxCompletedId = Math.max(...completedLessons);
    return maxCompletedId + 1;
  }, [completedLessons]);

  /**
   * Render an individual chapter
   * @param {Object} chapter - Chapter data
   * @param {number} index - Chapter index
   * @returns {React.Component} Rendered Chapter component
   */
  const renderChapter = useCallback((chapter, index) => (
    <Chapter
      key={`${index}-${hotReloadCountRef.current}`} // Add hot reload count to force re-render
      chapter={chapter}
      chapterIndex={index}
      completedLessons={completedLessons}
      lowestUncompletedLessonId={lowestUncompletedLessonId}
      lowestUncompletedRef={lowestUncompletedRef}
    />
  ), [completedLessons, lowestUncompletedLessonId, hotReloadCountRef.current]);

  /**
   * Handle completion of the fade animation
   */
  const onFadeComplete = () => {
    setIsLoading(false);
  };

  /**
   * Perform initial setup and scroll to the next uncompleted lesson
   */
  const performInitialSetup = () => {
    setIsLoading(true);
    fadeAnim.value = 1;

    // Use requestAnimationFrame to ensure we're working with the latest layout
    requestAnimationFrame(() => {
      if (scrollViewRef.current && lowestUncompletedRef.current) {
        const screenHeight = Dimensions.get('window').height;
        lowestUncompletedRef.current.measureLayout(
          scrollViewRef.current,
          (left, top) => {
            const targetY = top - (screenHeight / 2 - heightOfCircle / 2);
            scrollViewRef.current.scrollTo({ y: targetY, animated: false });
            setTimeout(() => {
              fadeAnim.value = withTiming(0, { duration: 300 }, () => {
                runOnJS(onFadeComplete)();
              });
            }, 0); // Adjust this delay if needed
          },
          () => console.log('measureLayout failed')
        );
      }
    });
  };

  // Effect to scroll to the updated next uncompleted lesson
  useEffect(() => {
    console.log('Scrolling to updated completedLessons');
    if (scrollViewRef.current && lowestUncompletedRef.current) {
      const screenHeight = Dimensions.get('window').height;
      lowestUncompletedRef.current.measureLayout(
        scrollViewRef.current,
        (left, top) => {
          const targetY = top - (screenHeight / 2 - heightOfCircle / 2);
          scrollViewRef.current.scrollTo({ y: targetY, animated: true });
          
          // Start fading out the overlay after scrolling
          setTimeout(() => {
            fadeAnim.value = withTiming(0, { duration: 300 }, () => {
              runOnJS(onFadeComplete)();
            });
          }, 0); // Adjust this delay if needed
        },
        () => console.log('measureLayout failed')
      );
    }
  }, [completedLessons]);

  // Effect to handle component mounting and hot reloads
  useEffect(() => {
    if (!mountedRef.current) {
      console.log('Component mounted for the first time');
      mountedRef.current = true;
    } else {
      console.log('Hot reload occurred');
      hotReloadCountRef.current += 1; // Increment hot reload count
    }
    
    // Delay the initial setup slightly to ensure all refs are properly set
    const timeoutId = setTimeout(() => {
      performInitialSetup();
    }, 100);

    // Cleanup function
    return () => {
      console.log('Component will unmount');
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array

  // Animated style for the loading overlay
  const overlayStyle = useAnimatedStyle(() => {
    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: color.background,
      opacity: fadeAnim.value,
      zIndex: fadeAnim.value === 0 ? -1 : 2,
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.content} 
        style={styles.scrollView}
      >
        {chapterData.slice().reverse().map(renderChapter)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
  },
  scrollView: {
    flex: 1,
  },
  chapter: {
    width: '100%',
    marginVertical: heightOfCircle * 1.25,
  },
  chapterTitleContainer: {
    position: 'absolute',
    bottom: -heightOfCircle * 1.95,
    width: '100%',
    height: heightOfCircle * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterIcon: {
    marginBottom: 5,
  },
  chapterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chapterSubTitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  lesson: {
    width: heightOfCircle,
    height: heightOfCircle,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: heightOfCircle / 5,
  },
  lessonIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    width: width * 0.8,
    marginLeft: (width - (width * 0.8)) / 2,
    marginRight: (width - (width * 0.8)) / 2,
    paddingBottom: heightOfCircle * 2.25,
  },
});

export default React.memo(ProgressTree);