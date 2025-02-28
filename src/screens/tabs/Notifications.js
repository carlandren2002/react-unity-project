import React, { useContext, useEffect } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import notifee from '@notifee/react-native';

import useStyles from '../../styles/GlobalStyles';
import Header2, { heightOfProgressBar } from '../../components/Header2';
import NotificationPreferences from '../../components/NotificationPreferences';
import { LessonContext } from '../../LessonContext';

/**
 * Displays a local notification to the user prompting them not to break their streak.
 * Requests permissions (iOS) and creates a notification channel (Android).
 * 
 * @async
 * @function onDisplayNotification
 * @returns {Promise<void>}
 */
async function onDisplayNotification() {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: "Don't break your streak!",
    body: "You're getting close to breaking your streak! Practice now to keep it going.",
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      pressAction: {
        id: 'default',
      },
    },
  });
}

/**
 * The Notifications component provides user notification settings, such as daily
 * reminders and streak reminders. It also automatically requests notification
 * permissions upon mounting.
 * 
 * @component
 * @returns {JSX.Element}
 */
const Notifications = () => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { notificationPreferences, updateNotificationPreferences } = useContext(LessonContext);

  /**
   * @typedef {Object} PreferenceItem
   * @property {string} title - The label for the preference.
   * @property {boolean} value - Indicates whether the preference is enabled or not.
   * @property {Function} onValueChange - Callback invoked when the preference toggles.
   */

  /**
   * @type {PreferenceItem[]}
   */
  const preferencesItem1 = [
    {
      title: 'Daily Reminders',
      value: notificationPreferences.dailyReminder,
      onValueChange: (newValue) =>
        updateNotificationPreferences({
          ...notificationPreferences,
          dailyReminder: newValue,
        }),
    },
  ];

  /**
   * @type {PreferenceItem[]}
   */
  const preferencesItem2 = [
    {
      title: 'Streak Reminder',
      value: notificationPreferences.streakReminder,
      onValueChange: (newValue) =>
        updateNotificationPreferences({
          ...notificationPreferences,
          streakReminder: newValue,
        }),
    },
  ];

  useEffect(() => {
    /**
     * Requests the notification permission when the component mounts.
     *
     * @async
     * @function requestPermissions
     * @returns {Promise<void>}
     */
    const requestPermissions = async () => {
      await notifee.requestPermission();
    };
    requestPermissions();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Header2
        title="Manage Notifications"
        showChevron
        onChevronPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentWide,
          {
            paddingTop: heightOfProgressBar,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <NotificationPreferences items={preferencesItem1} />
        <NotificationPreferences items={preferencesItem2} />
      </ScrollView>
    </View>
  );
};

export default Notifications;