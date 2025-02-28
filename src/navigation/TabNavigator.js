import React from 'react';
import { View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';

// Screen components
import Home from '../screens/tabs/Home';
import Profile from '../screens/tabs/Profile';

// Styles
import useStyles from '../styles/GlobalStyles';

const Tab = createBottomTabNavigator();

/**
 * Route configuration map for tab icons and sizes
 * @type {Object.<string, {icon: string, size: number}>}
 */
const TAB_ROUTE_CONFIG = {
  'Öva': { icon: 'car', size: 20 },
  'Teori': { icon: 'book', size: 16 },
  'Profil': { icon: 'user-alt', size: 16 }
};

/**
 * Main bottom tab navigator for the application
 * @returns {React.ReactElement} Bottom tab navigator with Home and Profile screens
 */
function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { styles, color: themeColors } = useStyles();

  /**
   * Renders the tab icon based on route and focus state
   * @param {Object} params - Icon parameters
   * @param {boolean} params.focused - Whether the tab is focused
   * @param {string} params.color - Color provided by the navigator
   * @param {number} params.size - Size provided by the navigator
   * @param {Object} params.route - Route information
   * @returns {React.ReactElement} Icon component
   */
  const renderTabIcon = ({ focused, color, size, route }) => {
    const routeConfig = TAB_ROUTE_CONFIG[route.name] || { icon: 'question', size: 16 };
    const iconColor = focused ? themeColors.primary : themeColors.mutedText;
    
    return (
      <Icon 
        style={{ marginTop: 3 }} 
        name={routeConfig.icon} 
        size={routeConfig.size} 
        color={iconColor} 
      />
    );
  };

  /**
   * Renders the blur effect background for iOS tab bar
   * @returns {React.ReactElement|null} BlurView for iOS, null for other platforms
   */
  const renderTabBackground = () => {
    if (Platform.OS !== 'ios') return null;
    
    return (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
        }}
      >
        <BlurView
          style={{ flex: 1, backgroundColor: 'transparent' }}
          blurType={themeColors.tabBar}
          blurAmount={60}
          reducedTransparencyFallbackColor={themeColors.surface}
        />
      </View>
    );
  };

  /**
   * Get tab bar style based on platform
   * @returns {Object} Tab bar style object
   */
  const getTabBarStyle = () => ({
    position: 'absolute',
    paddingHorizontal: 35,
    paddingTop: 5,
    height: 75,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'white',
  });

  return (
    <Tab.Navigator
      initialRouteName="Öva"
      screenOptions={({ route }) => ({
        tabBarIcon: (props) => renderTabIcon({ ...props, route }),
        headerShown: false,
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.mutedText,
        tabBarStyle: getTabBarStyle(),
        tabBarBackground: renderTabBackground,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Öva" component={Home} />
      <Tab.Screen name="Profil" component={Profile} />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;