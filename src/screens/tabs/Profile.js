/********************************************************************************
 * Profile Screen
 * 
 * This screen displays a user's profile information including streaks, 
 * completed lessons, and provides options for creating an account, 
 * signing out, or accessing other features.
 *
 ********************************************************************************/

import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import useStyles from '../../styles/GlobalStyles';
import { AuthContext } from '../../AuthContext';
import { LessonContext } from '../../LessonContext';
import Header2, { heightOfProgressBar } from '../../components/Header2';
import Button from '../../components/Button';

/**
 * @typedef {Object} ItemType
 * @property {string} icon - The name of the icon to be displayed.
 * @property {string} color - The color used for the icon and/or title.
 * @property {string} title - The main title text.
 * @property {string} [subtitle] - The subtitle text (optional).
 * @property {boolean} [redTitle] - If true, renders the title in red (optional).
 * @property {Function} onPress - The function to execute on item press.
 */

/**
 * Profile component that displays a user’s information, achievements, and
 * account creation/sign-out options.
 *
 * @returns {JSX.Element} The rendered component.
 */
const Profile = () => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Contexts
  const { user } = useContext(AuthContext);
  const { currentStreak, completedLessons } = useContext(LessonContext);

  return (
    <View style={styles.container}>
      <Header2 
        showCog 
        onCogPress={() => navigation.navigate('Settings')}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: heightOfProgressBar + 25,
          paddingBottom: insets.bottom + 100,
        }}
      >
        <View style={styles.textContainerL}>
          {user.isGuest ? (
            <View style={styles.createAccountSurface}>
              <Text
                style={[
                  styles.title,
                  {
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    color: color.text,
                  },
                ]}
              >
                Create An Account
              </Text>
              <Text
                style={[
                  styles.mutedText,
                  {
                    textAlign: 'center',
                    flexWrap: 'wrap',
                    color: color.mutedText,
                  },
                ]}
              >
                Save your progress across devices, {'\n'} and more.
              </Text>
              <View style={styles.createAccountSurfaceButton}>
                <Button
                  title="Create Account"
                  primary
                  onPress={() => navigation.navigate('Create Account')}
                />
              </View>
            </View>
          ) : (
            <View style={{ marginBottom: 50, alignItems: 'center' }}>
              <Text
                style={[
                  styles.hugeTitle,
                  { flexWrap: 'wrap', maxWidth: '70%', textAlign: 'center' },
                ]}
              >
                {user && !user.isGuest
                  ? user.attributes.preferred_username || user.signInDetails.loginId
                  : 'Guest User'}
              </Text>
              <Text
                style={[
                  styles.mutedText,
                  { flexWrap: 'wrap', maxWidth: '70%', textAlign: 'center' },
                ]}
              >
                {user && !user.isGuest
                  ? user.signInDetails.loginId
                  : 'Guest User'}
              </Text>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 5,
              marginHorizontal: 40,
            }}
          >
            <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 5 }}>
              <FontAwesome6
                name="book"
                size={35}
                color={color.successPrimary}
                style={{ marginBottom: 5 }}
              />
              <Text style={styles.smallTitle}>
                {completedLessons ? completedLessons.length * 5 : 0} min
              </Text>
              <Text style={styles.smallSubTitle}>
                TIME{'\n'} STUDIED
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 5 }}>
              <FontAwesome6
                name="car"
                size={35}
                color={color.iconLila}
                style={{ marginBottom: 5 }}
              />
              <Text style={styles.smallTitle}>
                {completedLessons ? completedLessons.length : 0}
              </Text>
              <Text style={styles.smallSubTitle}>AVKLARADE LEKTIONER</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'center', marginHorizontal: 5 }}>
              <FontAwesome6
                name="fire"
                size={35}
                color={color.errorPrimary}
                style={{ marginBottom: 5 }}
              />
              <Text style={styles.smallTitle}>
                {currentStreak ? currentStreak : 0} days
              </Text>
              <Text style={styles.smallSubTitle}>LONGEST STREAK</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
