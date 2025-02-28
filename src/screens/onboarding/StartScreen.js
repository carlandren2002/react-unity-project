import React from 'react';
import { View, Text, Image } from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Button from '../../components/Button';
import useStyles from '../../styles/GlobalStyles';

/**
 * @function OnboardingScreen
 * @description Displays a series of slides to introduce users to the app. It includes
 * a "Get Started" button and a "Log In" link.
 * @param {Object} props - Component props
 * @param {Object} props.navigation - React Navigation prop for screen transitions
 * @returns {JSX.Element} The rendered onboarding screen component
 */
function OnboardingScreen({ navigation }) {
  const { styles, color } = useStyles();
  const insets = useSafeAreaInsets();

  /**
   * @function handleStartPress
   * @description Navigates the user to the Signup screen
   */
  const handleStartPress = () => {
    navigation.navigate('Signup');
  };

  /**
   * @function handleLoginPress
   * @description Navigates the user to the Login screen
   */
  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Swiper for onboarding slides */}
      <Swiper
        style={styles.wrapper}
        loop={false}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
      >
        {/* Slide 1 */}
        <View style={styles.slide}>
          <LinearGradient
            colors={[color.bgTransparent, color.background, color.background]}
            style={styles.gradient1}
          />
          <Image
            source={require('../../assets/images/Devices/Apple/onboarding1.png')}
            style={styles.imageSwiper1}
          />
          <Text style={styles.titleSwiper}>
            Övningskör {'\n'}
            <Text style={{ color: color.primary }}>i mobilen</Text> med Teo
          </Text>
        </View>

        {/* Slide 2 */}
        <View style={styles.slide}>
          <Text style={styles.titleSwiper}>
            Cut costs {'\n'} on driver's ed
          </Text>
          <LinearGradient
            colors={[color.bgTransparent, color.background, color.background]}
            style={styles.gradient1}
          />
          <Image
            source={require('../../assets/images/Devices/Apple/onboarding2.png')}
            style={styles.imageSwiper1}
          />
        </View>

        {/* Slide 3 */}
        <View style={styles.slide}>
          <Text style={styles.titleSwiper}>Fun, bite-size{'\n'} lessons</Text>
          <LinearGradient
            colors={[color.background, color.background, color.bgTransparent]}
            style={styles.gradient2}
          />
          <Image
            source={require('../../assets/images/Devices/Apple/onboarding3.png')}
            style={styles.imageSwiper2}
          />
        </View>
      </Swiper>

      {/* Instructional text for swiping */}
      <Text style={styles.swipeText}>SWIPE TO DISCOVER MORE</Text>

      {/* Footer with Sign Up & Log In options */}
      <View style={[styles.footer, { paddingBottom: insets.bottom, paddingTop: 60 }]}>
        <View style={styles.footerContent}>
          <View style={styles.buttonContainerStart}>
            <Button title="Kom igång" onPress={handleStartPress} primary={true} />
            <TouchableOpacity onPress={handleLoginPress} style={styles.loginContainer}>
              <Text style={styles.mutedText}>Har du redan ett konto? </Text>
              <Text style={styles.primaryText}>Logga in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default OnboardingScreen;
