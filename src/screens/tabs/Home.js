import React, { useState, useEffect, useContext, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

import useStyles from '../../styles/GlobalStyles';
import ProgressTree from '../../components/ProgressTree';

import Chapter1 from '../../chapters/chapter1.json';
import Chapter2 from '../../chapters/chapter2.json';
import Chapter3 from '../../chapters/chapter3.json';

import { LessonContext } from '../../LessonContext';

/**
 * Home screen component that displays a progress tree of lessons
 * across multiple chapters. Lessons completed by the user are marked
 * within the LessonContext. Data is updated upon screen focus.
 *
 * @component
 * @returns {JSX.Element} The rendered Home screen.
 */
const Home = () => {
  const { styles, color } = useStyles();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const [chapterData, setChapterData] = useState([]);
  const [displayedCompletedLessons, setDisplayedCompletedLessons] = useState([]);

  const { completedLessons } = useContext(LessonContext);
  const prevCompletedLessonsRef = useRef(completedLessons);

  /**
   * Populates the list of chapters and their associated data.
   * Runs on component mount.
   */
  useEffect(() => {
    setChapterData([
      {
        title: 'Kapitel 1',
        subTitle: 'Grundläggande \n trafikregler',
        lessonData: Chapter1,
      },
      {
        title: 'Kapitel 2',
        subTitle: 'Högerregeln',
        lessonData: Chapter2,
      },
      {
        title: 'Kapitel 3',
        subTitle: 'Huvudled',
        lessonData: Chapter3,
      }
    ]);
  }, []);

  /**
   * Syncs displayed completed lessons with the global LessonContext
   * whenever the screen is focused or the completed lessons are updated.
   */
  useEffect(() => {
    if (isFocused) {
      if (prevCompletedLessonsRef.current !== completedLessons) {
        setDisplayedCompletedLessons(completedLessons);
      }
      prevCompletedLessonsRef.current = completedLessons;
    }
  }, [isFocused, completedLessons]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[color.background, color.bgTransparent]}
        style={[styles.topGradient, { marginTop: insets.top }]}
      />
      <ProgressTree
        chapterData={chapterData}
        completedLessons={displayedCompletedLessons}
      />
    </View>
  );
};

export default Home;