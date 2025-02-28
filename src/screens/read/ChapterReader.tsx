import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { useRoute, NavigationProp, useNavigation, RouteProp } from '@react-navigation/native';
import Header, { heightOfProgressBar } from '../../components/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import LinearGradient from 'react-native-linear-gradient';
import useStyles from '../../styles/GlobalStyles';

// Import Reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';

// Import Finished component
import Finished from '../game/Finished';

type LessonContentItem =
  | { type: 'title'; text: string }
  | { type: 'subtitle'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'card'; title?: string; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; author?: string };

type Lesson = {
  lessonIndex: any;
  title?: string;
  description?: string;
  content?: LessonContentItem[];
};

type RouteParams = {
  lesson: Lesson;
};

const ChapterReader: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { styles, color } = useStyles();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const navigation = useNavigation<NavigationProp<any>>();
  const { lesson } = route.params;

  // ========================
  // FINISH LEVEL
  // ========================
  const [finishedVisible, setFinishedVisible] = useState(false);

  const Finish = () => {
    setFinishedVisible(true);
  };

  const animationProgress = useSharedValue(0);

  useEffect(() => {
    if (finishedVisible) {
      animationProgress.value = withTiming(1, { duration: 300 });
    } else {
      animationProgress.value = 0;
    }
  }, [finishedVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationProgress.value, [0, 1], [0.5, 1]);
    const opacity = animationProgress.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // ========================
  // QUIT
  // ========================
  const confirmNavigation = () => {
    try {
      navigation.navigate('TabNavigator');
    } catch (error) {
      console.error('Error navigating to Main:', error);
    }
  };

  const renderContentItem = (item: LessonContentItem, index: number) => {
    switch (item.type) {
      case 'title':
        return (
          <Text key={index} style={styles.titleChapter}>
            {item.text}
          </Text>
        );
      case 'subtitle':
        return (
          <Text key={index} style={styles.subtitleChapter}>
            {item.text}
          </Text>
        );
      case 'paragraph':
        return (
          <Text key={index} style={styles.paragraphChapter}>
            {item.text}
          </Text>
        );
      case 'image':
        return (
          <View key={index} style={styles.imageContainerChapter}>
            <Image source={{ uri: item.url }} style={styles.imageChapter as never} />
            {item.caption && <Text style={styles.captionChapter}>{item.caption}</Text>}
          </View>
        );
      case 'card':
        return (
          <View key={index} style={styles.cardChapter}>
            {item.title && <Text style={styles.cardTitleChapter}>{item.title}</Text>}
            <Text style={styles.cardTextChapter}>{item.text}</Text>
          </View>
        );
      case 'list':
        return (
          <View key={index} style={styles.listChapter}>
            {item.items.map((listItem, idx) => (
              <Text key={idx} style={styles.listItemChapter}>
                • {listItem}
              </Text>
            ))}
          </View>
        );
      case 'quote':
        return (
          <View key={index} style={styles.quoteContainer}>
            <Text style={styles.quoteTextChapter}>"{item.text}"</Text>
            {item.author && <Text style={styles.quoteAuthorChapter}>- {item.author}</Text>}
          </View>
        );
      default:
        return null;
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
      backgroundColor: color.background,
      zIndex: 9999,
    },
  });

  return (
    <View style={styles.container}>
      <Header onClose={confirmNavigation} progress={undefined} altIcon={undefined} bar={undefined} />
       <LinearGradient
        colors={[color.background, color.bgTransparent]}
        style={[styles.topGradient, { top: heightOfProgressBar }]}
      />
      <ScrollView
        style={styles.scrollContainerChapter}
        contentContainerStyle={{ paddingTop: heightOfProgressBar + 30 }}
      >
        {lesson.content &&
          lesson.content.map((item, index) => renderContentItem(item, index))}
        <View style={{ paddingTop: 24, paddingBottom: insets.bottom }}>
          <Button primary title="Gå vidare" onPress={Finish} />
        </View>
      </ScrollView>

      {/* Finished Component with Animation */}
      {finishedVisible && (
        <Animated.View style={[additionalStyles.finishedContainer, animatedStyle]}>
          <Finished lessonIndex={lesson.lessonIndex} onGoToTop={confirmNavigation} />
        </Animated.View>
      )}
    </View>
  );
};

export default ChapterReader;
