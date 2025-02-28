import React, { useContext, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Onboarding screens
import StartScreen from '../screens/onboarding/StartScreen';
import Signup from '../screens/onboarding/Signup';
import Login from '../screens/onboarding/Login';
import RequestReset from '../screens/onboarding/RequestReset';
import ConfirmReset from '../screens/onboarding/ConfirmReset';

// Main app screens
import TabNavigator from './TabNavigator';
import Settings from '../screens/tabs/Settings';
import Account from '../screens/tabs/Account';
import ChangeName from '../screens/tabs/ChangeName';
import Notifications from '../screens/tabs/Notifications';

// Game and content screens
import Unity from '../screens/game/Unity';
import Finished from '../screens/game/Finished';
import ChapterReader from '../screens/read/ChapterReader';
import Quiz from '../screens/quiz/Quiz';

// Contexts and styles
import { AuthContext } from '../AuthContext';
import { LessonContext } from '../LessonContext';
import { useTheme } from '../ThemeContext';
import useStyles from '../styles/GlobalStyles';

const Stack = createNativeStackNavigator();

/**
 * Main navigation component that handles authenticated and unauthenticated routes
 * @returns {React.ReactElement} The appropriate navigation stack based on authentication state
 */
function AppNavigator() {
  const { styles, color } = useStyles();
  const { theme } = useTheme();
  const { user, isLoading: isAuthLoading } = useContext(AuthContext);
  const { isLoadingLessons } = useContext(LessonContext);

  const isAuthenticated = useMemo(() => !!user, [user]);
  const isLoading = isAuthLoading || isLoadingLessons;
  
  // Common screen options for all stacks
  const commonScreenOptions = {
    navigationBarColor: color.background,
    statusBarStyle: theme === 'light' ? 'dark' : 'light',
    statusBarColor: color.background,
    contentStyle: { backgroundColor: color.background },
  };

  /**
   * Renders loading indicator when data is being fetched
   * @returns {React.ReactElement} Loading spinner centered on screen
   */
  const renderLoadingState = () => (
    <View style={[styles.absoluteFill, styles.loadingContainer, { backgroundColor: color.background }]}>
      <ActivityIndicator size="small" color={color.mutedText} />
    </View>
  );

  /**
   * Navigation stack for authenticated users
   * @returns {React.ReactElement} Stack navigator with authenticated routes
   */
  const renderAuthenticatedStack = () => (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          headerShown: false,
          statusBarColor: color.background,
          navigationBarColor: color.surface,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          statusBarColor: color.background,
          navigationBarColor: color.background,
        }}
      />
      <Stack.Screen
        name="Manage Account"
        component={Account}
        options={{
          headerShown: false,
          statusBarColor: color.background,
          navigationBarColor: color.background,
        }}
      />
      <Stack.Screen
        name="Change Name"
        component={ChangeName}
        options={{
          headerShown: false,
          statusBarColor: color.background,
          navigationBarColor: color.background,
        }}
      />
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerShown: false,
          statusBarColor: color.background,
          navigationBarColor: color.background,
        }}
      />
      <Stack.Screen
        name="Unity"
        component={Unity}
        options={{
          headerShown: false,
          navigationBarHidden: true, 
        }}
      />
      <Stack.Screen
        name="Quiz"
        component={Quiz}
        options={{
          headerShown: false,
          navigationBarHidden: true, 
        }}
      />
      <Stack.Screen
        name="ChapterReader"
        component={ChapterReader}
        options={{
          headerShown: false,
          navigationBarHidden: true, 
        }}
      />
      <Stack.Screen
        name="Finished"
        component={Finished}
        options={{
          headerShown: false,
          statusBarHidden: false,
          autoHideHomeIndicator: false,
          navigationBarHidden: false,
        }}
      />
    </Stack.Navigator>
  );

  /**
   * Navigation stack for unauthenticated users
   * @returns {React.ReactElement} Stack navigator with onboarding routes
   */
  const renderUnauthenticatedStack = () => (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name="StartScreen"
        component={StartScreen}
        options={{
          headerShown: false,
          statusBarStyle: theme === 'light' ? 'dark' : 'light',
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false,
          statusBarStyle: theme === 'light' ? 'dark' : 'light',
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          statusBarStyle: theme === 'light' ? 'dark' : 'light',
        }}
      />
      <Stack.Screen
        name="Request Reset"
        component={RequestReset}
        options={{
          headerShown: false,
          statusBarStyle: theme === 'light' ? 'dark' : 'light',
        }}
      />
      <Stack.Screen
        name="Confirm Reset"
        component={ConfirmReset}
        options={{
          headerShown: false,
          statusBarStyle: theme === 'light' ? 'dark' : 'light',
        }}
        initialParams={{ email: '' }}
      />
    </Stack.Navigator>
  );

  // Show loading state if still loading
  if (isLoading) {
    return renderLoadingState();
  }

  return (
    <View style={[{ flex: 1 }, { backgroundColor: color.background }]}>
      {isAuthenticated ? renderAuthenticatedStack() : renderUnauthenticatedStack()}
    </View>
  );
}

export default AppNavigator;