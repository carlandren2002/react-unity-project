import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import lessonDataFile from './chapters/chapter1.json';
import { generateClient } from 'aws-amplify/api';
import { AuthContext } from './AuthContext';
import NetInfo from "@react-native-community/netinfo";
import notifee, {
  TriggerType,
  RepeatFrequency
} from '@notifee/react-native';

/**
 * Initialize the AWS AppSync client
 */
const client = generateClient({
  authMode: 'userPool'
});

/**
 * GraphQL query to get user lessons data
 */
const getUserLessons = /* GraphQL */ `
  query GetUserLessons($userId: ID!) {
    getUserLessons(userId: $userId) {
      userId
      completedLessonIndices
    }
  }
`;

/**
 * GraphQL mutation to add completed lessons
 */
const addCompletedLesson = /* GraphQL */ `
  mutation AddCompletedLesson($userId: ID!, $lessonIndex: Int!) {
    addCompletedLesson(userId: $userId, lessonIndex: $lessonIndex) {
      userId
      completedLessonIndices
    }
  }
`;

/**
 * GraphQL mutation to delete all completed lessons
 */
const deleteAllCompletedLessons = /* GraphQL */ `
  mutation DeleteAllCompletedLessons($userId: ID!) {
    deleteAllCompletedLessons(userId: $userId) {
      success
    }
  }
`;

/**
 * Creates a React Context for lesson data.
 */
export const LessonContext = createContext();

/**
 * LessonContextProvider component.
 * 
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - Child components that will have access to this context.
 * @returns {JSX.Element} The provider component with lesson-related state and methods.
 */
export const LessonContextProvider = ({ children }) => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState({
    dailyReminder: false,
    streakReminder: false,
  });
  const [lastStudyTime, setLastStudyTime] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const lessonData = lessonDataFile;
  const { user } = useContext(AuthContext);
  const [notificationPermission, setNotificationPermission] = useState(false);

  // ----------------------
  // AUTH
  // ----------------------

  useEffect(() => {
    if (user) {
      loadCompletedLessons();
      loadUserData();
    } else {
      console.log('Cleared user data');
      setCompletedLessons([]);
      setIsLoadingLessons(false);
      setNotificationPreferences({ dailyReminder: false, streakReminder: false });
      setLastStudyTime(null);
      setCurrentStreak(0);
    }
  }, [user]);

  /**
   * Hydrates lesson state from AsyncStorage on app start.
   */
  useEffect(() => {
    const hydrateLessons = async () => {
      const storedLessons = await AsyncStorage.getItem('completedLessons');
      setCompletedLessons(storedLessons ? JSON.parse(storedLessons) : []);
      setIsLoadingLessons(false);
    };
    hydrateLessons();
  }, []);

  // ----------------------
  // NOTIFICATIONS
  // ----------------------

  useEffect(() => {
    createNotificationChannel();
  }, []);

  /**
   * Loads user-specific data from AsyncStorage (notification preferences, last study time, and streak).
   */
  const loadUserData = async () => {
    if (user) {
      const storedPreferences = await AsyncStorage.getItem(`notificationPreferences_${user.userId}`);
      if (storedPreferences) {
        setNotificationPreferences(JSON.parse(storedPreferences));
      }

      const storedLastStudyTime = await AsyncStorage.getItem(`lastStudyTime_${user.userId}`);
      if (storedLastStudyTime) {
        setLastStudyTime(storedLastStudyTime);
      }

      const storedStreak = await AsyncStorage.getItem(`currentStreak_${user.userId}`);
      if (storedStreak) {
        setCurrentStreak(parseInt(storedStreak, 10));
      }
    }
  };

  /**
   * Requests permission for notifications.
   * @returns {Promise<boolean>} Whether permission was granted.
   */
  const requestNotificationPermission = async () => {
    const settings = await notifee.requestPermission();
    const isGranted = settings.authorizationStatus >= 1; // 1 is AUTHORIZED, 2 is PROVISIONAL
    setNotificationPermission(isGranted);
    await AsyncStorage.setItem('notificationPermissionRequested', 'true');
    return isGranted;
  };

  /**
   * Checks current notification permission status.
   * @returns {Promise<boolean>} Whether notification permission is granted.
   */
  const checkNotificationPermission = async () => {
    const settings = await notifee.getNotificationSettings();
    const isGranted = settings.authorizationStatus >= 1;
    setNotificationPermission(isGranted);
    return isGranted;
  };

  /**
   * Updates notification preferences in state and AsyncStorage, then re-schedules notifications.
   * @param {Object} newPreferences - The new notification preferences.
   */
  const updateNotificationPreferences = async (newPreferences) => {
    setNotificationPreferences(newPreferences);
    if (user) {
      await AsyncStorage.setItem(
        `notificationPreferences_${user.userId}`,
        JSON.stringify(newPreferences)
      );
      updateNotifications(newPreferences);
    }
  };

  /**
   * Updates the last study time, stores it in AsyncStorage, and updates the streak.
   */
  const updateLastStudyTime = async () => {
    const now = new Date().toISOString();
    setLastStudyTime(now);
    if (user) {
      await AsyncStorage.setItem(`lastStudyTime_${user.userId}`, now);
      updateStreak(now);
    }
  };

  /**
   * Updates the current study streak based on the last study time.
   * @param {string} studyTime - The current study time in ISO string format.
   */
  const updateStreak = async (studyTime) => {
    const lastStudy = new Date(lastStudyTime);
    const currentStudy = new Date(studyTime);
    const diffDays = Math.floor((currentStudy - lastStudy) / (1000 * 60 * 60 * 24));

    let newStreak = currentStreak;
    if (diffDays === 0 || diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    setCurrentStreak(newStreak);
    if (user) {
      await AsyncStorage.setItem(`currentStreak_${user.userId}`, newStreak.toString());
    }
  };

  /**
   * Clears user progress both locally (AsyncStorage) and remotely (AWS).
   */
  const clearProgress = async () => {
    try {
      if (user) {
        const result = await client.graphql({
          query: deleteAllCompletedLessons,
          variables: { userId: user.userId },
        });
        if (result.data.deleteAllCompletedLessons.success) {
          console.log('Successfully deleted all lessons in AWS');
        } else {
          console.error('Failed to delete lessons in AWS');
        }
      }
      setCompletedLessons([]);
      setLastStudyTime(null);
      setCurrentStreak(0);
      await AsyncStorage.removeItem('completedLessons');
      await AsyncStorage.removeItem(`lastStudyTime_${user.userId}`);
      await AsyncStorage.removeItem(`currentStreak_${user.userId}`);
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  };

  /**
   * Loads completed lessons from AsyncStorage and, if online, merges with AWS data.
   */
  const loadCompletedLessons = async () => {
    let localLessons = [];
    try {
      console.log('Loading completed lessons');

      // Fetch lessons from AsyncStorage
      const asyncStorageLessons = await AsyncStorage.getItem('completedLessons');
      if (asyncStorageLessons) {
        localLessons = JSON.parse(asyncStorageLessons);
        console.log('Lessons from AsyncStorage:', localLessons);
      }

      // Check for internet connection and non-guest user
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected && user && user.userId && !user.isGuest) {
        console.log('Internet connected, fetching from AWS');
        const result = await client.graphql({
          query: getUserLessons,
          variables: { userId: user.userId },
        });

        if (result.data && result.data.getUserLessons) {
          const awsLessons = result.data.getUserLessons.completedLessonIndices || [];
          console.log('Lessons from AWS:', awsLessons);
          localLessons = [...new Set([...localLessons, ...awsLessons])];
        } else {
          console.log('No completed lessons found in AWS for this user', user.userId);
        }
      } else {
        console.log('Offline or guest user, using only local data');
      }

      // Expand localLessons to include all integers up to the maximum index
      if (localLessons.length > 0) {
        const maxLessonIndex = Math.max(...localLessons);
        localLessons = Array.from({ length: maxLessonIndex + 1 }, (_, i) => i);
      }

      // Update AsyncStorage with potentially merged lessons
      await AsyncStorage.setItem('completedLessons', JSON.stringify(localLessons));

      console.log('Final completed lessons:', localLessons);
      setCompletedLessons(localLessons);
    } catch (error) {
      console.error('Error loading completed lessons:', error);
      if (error.errors) {
        console.error('GraphQL errors:', JSON.stringify(error.errors, null, 2));
      }
    } finally {
      setIsLoadingLessons(false);
    }
  };

  /**
   * Stores a completed lesson locally and attempts to sync with AWS.
   * @param {number} lessonIndex - The index of the completed lesson.
   */
  const storeCompletedLesson = async (lessonIndex) => {
    try {
      console.log('Storing completed lesson:', lessonIndex);

      let updatedLessons = [...completedLessons];

      // Check if the lesson is valid and hasn't been stored already
      if (lessonIndex !== undefined && !updatedLessons.includes(lessonIndex)) {
        updatedLessons.push(lessonIndex);

        // Expand updatedLessons to include all integers up to the maximum index
        const maxLessonIndex = Math.max(...updatedLessons);
        updatedLessons = Array.from({ length: maxLessonIndex + 1 }, (_, i) => i);

        // Update AsyncStorage with the new lessons
        await AsyncStorage.setItem('completedLessons', JSON.stringify(updatedLessons));
        console.log('Updated AsyncStorage with lessons:', updatedLessons);

        // Update the UI or app state with completed lessons
        setCompletedLessons(updatedLessons);

        // Attempt AWS GraphQL storage only if a user exists
        if (user && user.userId && !user.isGuest) {
          try {
            console.log('Attempting to store lesson in AWS:', user.userId, lessonIndex);

            const result = await client.graphql({
              query: addCompletedLesson,
              variables: { userId: user.userId, lessonIndex: parseInt(lessonIndex) },
            });

            console.log('AWS storage result:', JSON.stringify(result, null, 2));

            if (result.data.addCompletedLesson === null) {
              console.error('Failed to add completed lesson in AWS');
              if (result.errors) {
                console.error('GraphQL errors:', JSON.stringify(result.errors, null, 2));
              }
            }
          } catch (awsError) {
            console.error('AWS GraphQL error:', awsError);
          }
        } else {
          console.log('No user found or guest user, skipping AWS storage');
        }

        // Update last study time and streak
        await updateLastStudyTime();
      } else {
        console.log('Lesson already completed or invalid lessonIndex');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      if (error.errors) {
        console.error('GraphQL errors:', JSON.stringify(error.errors, null, 2));
      }
    }
  };

  /**
   * Creates a notification channel for study reminders.
   */
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'study-reminders',
      name: 'Study Reminders',
      importance: 4,
    });
  };

  /**
   * Schedules a daily reminder notification at 8:00 PM.
   */
  const scheduleDailyReminder = async () => {
    const now = new Date();
    let triggerDate = new Date(now);
    triggerDate.setHours(20, 0, 0, 0); // Set to 8:00 PM

    // If it's already past 8:00 PM, set the trigger for tomorrow
    if (triggerDate <= now) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    };

    await notifee.createTriggerNotification(
      {
        title: 'Time to Study!',
        body: 'Keep your streak going by studying today.',
        android: { channelId: 'study-reminders' },
        ios: { categoryId: 'study-reminders' },
      },
      trigger
    );
  };

  /**
   * Schedules a streak reminder notification for 8:00 PM the day after the last study time.
   */
  const scheduleStreakReminder = async () => {
    console.log('scheduleStreakReminder - start');
    if (!lastStudyTime) {
      console.log('scheduleStreakReminder - no last study time');
      return;
    }

    const now = new Date();
    let nextDay = new Date(lastStudyTime);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(20, 0, 0, 0); // 8:00 PM the next day

    console.log('scheduleStreakReminder - next day: ', nextDay);

    if (nextDay <= now) {
      nextDay.setDate(nextDay.getDate() + 1);
    }

    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: nextDay.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        title: "Don't Break Your Streak!",
        body: "You're close to breaking your study streak. Study now to keep it going!",
        android: { channelId: 'study-reminders' },
        ios: { categoryId: 'study-reminders' },
      },
      trigger
    );
    console.log('scheduleStreakReminder - finished');
  };

  /**
   * Cancels all notifications and re-schedules them based on current preferences.
   * @param {Object} preferences - The updated notification preferences.
   */
  const updateNotifications = async (preferences) => {
    await notifee.cancelAllNotifications();

    if (preferences.dailyReminder) {
      await scheduleDailyReminder();
    }

    if (preferences.streakReminder) {
      await scheduleStreakReminder();
    }
  };

  return (
    <LessonContext.Provider
      value={{
        lessonData,
        completedLessons,
        storeCompletedLesson,
        clearProgress,
        isLoadingLessons,
        notificationPreferences,
        updateNotificationPreferences,
        lastStudyTime,
        currentStreak,
        notificationPermission,
        requestNotificationPermission,
        checkNotificationPermission,
      }}
    >
      {children}
    </LessonContext.Provider>
  );
};
