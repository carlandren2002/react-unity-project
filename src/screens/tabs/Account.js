import React, { useContext } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useStyles from '../../styles/GlobalStyles';
import Header2, { heightOfProgressBar } from '../../components/Header2';
import ProfileList from '../../components/ProfileList';
import { AuthContext } from '../../AuthContext';
import { LessonContext } from '../../LessonContext';

/**
 * The Account component provides a user interface for updating account information,
 * such as username and password, as well as deleting the account entirely.
 * 
 * @component
 * @returns {JSX.Element} The rendered Account screen.
 */
const Account = () => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user, handleDeleteUser } = useContext(AuthContext);
  const { clearProgress } = useContext(LessonContext);

  /**
   * Deletes all progress data and then deletes the user account. 
   * This is a permanent action.
   *
   * @async
   * @function deleteUserDataAndUser
   */
  const deleteUserDataAndUser = async () => {
    await clearProgress();
    await handleDeleteUser();
  };

  /**
   * Items to be displayed in the first ProfileList component.
   * Each item has a title, subtitle, and optional edit action.
   */
  const profileItems = [
    {
      title: user.attributes.preferred_username,
      subtitle: 'Name',
      editable: true,
      onEdit: () => navigation.navigate('Change Name'),
    },
    {
      title: user.signInDetails.loginId,
      subtitle: 'Email',
      editable: false,
    },
    {
      title: '********',
      subtitle: 'Password',
      editable: true,
      onEdit: () => {
        // TODO: Handle edit password
      },
    },
  ];

  /**
   * Items to be displayed in the second ProfileList component.
   * Includes an option to delete the user account.
   */
  const profileItems2 = [
    {
      redTitle: true,
      title: 'Delete Account',
      subtitle: 'This is permanent',
      onPress: deleteUserDataAndUser,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Header2
        title="Manage Account"
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
        <ProfileList items={profileItems} />
        <ProfileList items={profileItems2} />
      </ScrollView>
    </View>
  );
};

export default Account;