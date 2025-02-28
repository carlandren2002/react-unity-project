import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import useStyles from '../../styles/GlobalStyles';
import Header2, { heightOfProgressBar } from '../../components/Header2';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../../AuthContext';
import { LessonContext } from '../../LessonContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomList from '../../components/CustomList';

/**
 * Settings component for user account management and app settings.
 *
 * @component
 * @returns {JSX.Element} The rendered Settings screen.
 */
const Settings = () => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const { user, handleSignOut, handleDeleteUser, currentLanguage } = useContext(AuthContext);
  const { clearProgress } = useContext(LessonContext);
  const insets = useSafeAreaInsets();

  // TODO make this make sense for both guests etc
  const items2 = [
    {
      icon: 'user',
      color: color.iconLila,
      title: 'Manage Account',
      subtitle: user?.signInDetails?.loginId || '',
      onPress: () => navigation.navigate('Manage Account'),
    },
    {
      icon: 'bell',
      color: color.primary,
      title: 'Notifications',
      subtitle: 'Set up your notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
  ];

  const items = [
    {
      icon: 'question-circle',
      color: color.iconGul,
      title: 'Support Center',
      onPress: () => console.log('Streak pressed'),
    },
    {
      icon: 'language',
      color: color.iconSilver,
      title: 'App Language',
      subtitle: currentLanguage || '',
      onPress: () => console.log('Saved Lines pressed'),
    },
    {
      icon: 'envelope',
      color: color.iconSilver,
      title: 'About',
      onPress: () => console.log('Saved Lines pressed'),
    },
    {
      icon: 'sign-out',
      color: color.errorPrimary,
      title: 'Logga ut',
      redTitle: true,
      onPress: () => handleLogOut(),
    },
  ];

  /**
   * Handles the logout process.
   *
   * If the user is a guest, an alert is shown to confirm deletion of progress.
   * Otherwise, it confirms the logout. In both cases, it attempts to clear the
   * AsyncStorage before calling the sign out handler.
   *
   * @function handleLogOut
   * @returns {void}
   */
  const handleLogOut = () => {
    if (user?.isGuest) {
      Alert.alert(
        'Delete All Progress',
        "All progress will be removed, since you're a guest user. Are you sure you want to log out?",
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Log Out',
            onPress: async () => {
              console.log('handleLogOut');
              try {
                await AsyncStorage.clear();
              } catch (error) {
                console.log(error);
              } finally {
                handleSignOut();
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to log out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Log Out',
            onPress: async () => {
              console.log('handleLogOut');
              try {
                await AsyncStorage.clear();
              } catch (error) {
                console.log(error);
              } finally {
                handleSignOut();
              }
            },
          },
        ]
      );
    }
  };

  /**
   * Deletes the user data and user account.
   *
   * This function clears the lesson progress and then calls the user deletion handler.
   *
   * @async
   * @function deleteUserDataAndUser
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  const deleteUserDataAndUser = async () => {
    await clearProgress();
    await handleDeleteUser();
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Header2 title="Inställningar" showChevron onChevronPress={() => navigation.goBack()} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentWide,
          { paddingTop: heightOfProgressBar, paddingBottom: insets.bottom },
        ]}
      >
        <CustomList items={items2} styles={styles} />
        <CustomList items={items} styles={styles} />
        <View style={{ paddingTop: 40, paddingBottom: 60 }}>
          <Text style={styles.littleMutedText}>
            Teo v{require('../../../package.json').version}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;
