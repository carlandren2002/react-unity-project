import React, {
    useEffect,
    useContext,
    useState,
    useCallback,
    useRef
  } from 'react';
  import {
    Alert,
    View,
    Dimensions,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    Text,
    TextInput,
    TouchableOpacity
  } from 'react-native';
  import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS
  } from 'react-native-reanimated';
  import { useNavigation } from '@react-navigation/native';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';
  import { ScrollView } from 'react-native-gesture-handler';
  import ProgressBar, { heightOfProgressBar } from '../../components/Header';
  import TeoButton from '../../components/Button';
  import useStyles from '../../styles/GlobalStyles';
  import { AuthContext } from '../../AuthContext';
  import { LessonContext } from '../../LessonContext';
  import { I18n } from 'aws-amplify/utils';
  import InAppBrowser from 'react-native-inappbrowser-reborn';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';
  
  const { width: deviceWidth } = Dimensions.get('window');
  
  /**
   * Onboarding Component
   * 
   * Handles the multi-step onboarding process:
   * 1. Ask user for a preferred username.
   * 2. Prompt user to enable notifications.
   * 3. Create an account with email and password.
   * 
   * @returns {JSX.Element} - The rendered Onboarding component.
   */
  const Onboarding = () => {
    const { styles, color } = useStyles();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
  
    const [progress, setProgress] = useState(0);
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  
    const [preferredUsername, setPreferredUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const [isFocusedPass, setIsFocusedPass] = useState(false);
    const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  
    const {
      handleSignUp,
      isLoadingALittle,
      createGuestUser
    } = useContext(AuthContext);
    
    const { requestNotificationPermission } = useContext(LessonContext);
  
    // Refs for automatically focusing inputs if needed
    const scrollViewRef = useRef(null);
    const usernameInputRef = useRef(null);
    const emailInputRef = useRef(null);
  
    // Shared values for animation transitions
    const opacityValues = Array(4)
      .fill()
      .map((_, i) => useSharedValue(i === 0 ? 1 : 0));
  
    // Reanimated shared value for horizontal slide transition
    const translateX = useSharedValue(0);
  
    /**
     * useEffect to handle alert messages triggered by errorMessage state changes.
     */
    useEffect(() => {
      if (errorMessage) {
        Alert.alert('Error', errorMessage);
        setErrorMessage(null);
      }
    }, [errorMessage]);
  
    /**
     * useEffect that runs when `step` changes to update the opacity of each step 
     * in the onboarding process with Reanimated.
     */
    useEffect(() => {
      opacityValues.forEach((opacity, index) => {
        opacity.value = withSpring(index === step ? 1 : 0, {
          damping: 100,
          stiffness: 160,
          useNativeDriver: true
        });
      });
    }, [step]);
  
    /**
     * Handles notification permission request.
     * 
     * @async
     * @function handleNotificationPermission
     * @param {boolean} allowNotifications - Indicates whether the user allowed notifications.
     * @returns {Promise<void>}
     */
    const handleNotificationPermission = async (allowNotifications) => {
      if (allowNotifications) {
        const isGranted = await requestNotificationPermission();
        console.log('Notification permission granted:', isGranted);
      }
      handleForward();
    };
  
    /**
     * Handles animated transition between steps.
     * 
     * @function handleTransition
     * @param {number} direction - The direction of transition (1 for next step, -1 for previous).
     */
    const handleTransition = useCallback(
      (direction) => {
        if (isAnimating) return;
  
        const newStep = step + direction;
        if (newStep >= 0 && newStep <= 3) {
          setIsAnimating(true);
          setStep(newStep);
          setProgress((prev) => prev + direction * 25);
  
          translateX.value = withSpring(
            translateX.value - direction * deviceWidth,
            {
              damping: 100,
              stiffness: 160,
              useNativeDriver: true
            },
            (finished) => {
              if (finished) {
                runOnJS(setIsAnimating)(false);
              }
            }
          );
        }
      },
      [isAnimating, step, translateX]
    );
  
    /**
     * Go forward one step in the onboarding flow.
     * 
     * @function handleForward
     */
    const handleForward = useCallback(() => {
      setErrorMessage(null);
      Keyboard.dismiss();
      if (isAnimating) return;
      handleTransition(1);
    }, [isAnimating, handleTransition]);
  
    /**
     * Go backward one step in the onboarding flow, 
     * or navigate back to StartScreen if on the first step.
     * 
     * @function handleBackwards
     */
    const handleBackwards = useCallback(() => {
      setErrorMessage(null);
      Keyboard.dismiss();
      if (isAnimating) return;
  
      if (step === 0) {
        navigation.navigate('StartScreen');
      } else {
        handleTransition(-1);
      }
    }, [isAnimating, step, navigation, handleTransition]);
  
    /**
     * Animated style for the main content transitions.
     */
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }]
    }));
  
    /**
     * Handle user sign-up and proceed to the next step if successful.
     * 
     * @async
     * @function handleSignUpAndRedirect
     * @param {string} email - User's email address.
     * @param {string} password - User's chosen password.
     * @param {string} preferredUsername - User's preferred username.
     * @returns {Promise<void>}
     */
    const handleSignUpAndRedirect = async (email, password, preferredUsername) => {
      Keyboard.dismiss();
  
      if (errorMessage) {
        setIsAnimatingOut(true);
        setErrorMessage(null);
      }
  
      try {
        await handleSignUp(email, password, preferredUsername);
        handleForward();
      } catch (error) {
        // Handle specific cognito error messages
        if (error.name && error.name === 'InvalidPasswordException') {
          setErrorMessage(I18n.get('Password must be at least 8 characters long'));
        } else if (error.name && error.name === 'InvalidParameterException') {
          setErrorMessage(I18n.get('Ange en giltlig e-postadress'));
        } else {
          setErrorMessage(I18n.get(error.message));
        }
      }
  
      // Reset error animation state
      setTimeout(() => {
        setIsAnimatingOut(false);
      }, 600);
    };
  
    /**
     * Helper to render a step's content wrapped in an Animated.View.
     * 
     * @function renderStep
     * @param {number} index - Index of the step.
     * @param {JSX.Element} content - The JSX to render for that step.
     * @returns {JSX.Element} - Wrapped step content.
     */
    const renderStep = (index, content) => (
      <Animated.View key={index}>
        {content}
      </Animated.View>
    );
  
    return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {/* Progress Bar with close/back action */}
        <ProgressBar progress={progress} onClose={handleBackwards} bar />
  
        {/* KeyboardAvoidingView to manage keyboard overlap */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'height' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.flexContainer}>
            {/* Animated content rows for steps */}
            <Animated.View
              style={[
                styles.contentRow,
                animatedStyle,
                { marginTop: heightOfProgressBar }
              ]}
            >
              {renderStep(
                0,
                <View style={{ flex: 1 }}>
                  <ScrollView
                    contentContainerStyle={{
                      flexGrow: 1,
                      width: deviceWidth * 0.8,
                      marginHorizontal: (deviceWidth - deviceWidth * 0.8) / 2
                    }}
                  >
                    <View style={styles.textContainerL}>
                      <Text style={styles.title}>Vad ska vi kalla dig?</Text>
                    </View>
                    <View>
                      <TextInput
                        ref={usernameInputRef}
                        style={styles.input}
                        placeholder="Namn"
                        onChangeText={(text) => setPreferredUsername(text)}
                        keyboardType="default"
                        autoComplete="off"
                        autoCorrect={false}
                      />
                    </View>
                  </ScrollView>
                </View>
              )}
  
              {renderStep(
                1,
                <View style={{ flex: 1 }}>
                  <ScrollView
                    contentContainerStyle={{
                      flexGrow: 1,
                      width: deviceWidth * 0.8,
                      marginHorizontal: (deviceWidth - deviceWidth * 0.8) / 2
                    }}
                  >
                    <View style={styles.textContainerL}>
                      <Text style={styles.title}>Stay on Track</Text>
                      <Text style={styles.subTitle}>
                        Enable notifications to get daily reminders and keep your
                        study streak going!
                      </Text>
                    </View>
                  </ScrollView>
                </View>
              )}
  
              {renderStep(
                2,
                <View style={{ flex: 1 }}>
                  <ScrollView
                    contentContainerStyle={{
                      flexGrow: 1,
                      paddingTop: 40,
                      width: deviceWidth * 0.8,
                      marginHorizontal: (deviceWidth - deviceWidth * 0.8) / 2
                    }}
                    ref={scrollViewRef}
                  >
                    <View style={styles.textContainerL}>
                      <Text style={styles.title}>Skapa ditt konto</Text>
                      <Text style={styles.subTitle}>
                        Så att dina klarade uppgifter sparas
                      </Text>
                    </View>
                    <View>
                      {/* Email Input */}
                      <View style={styles.inputWithIcon}>
                        <TextInput
                          style={styles.input}
                          placeholder="E-post"
                          onChangeText={(text) => {
                            setEmail(text);
                          }}
                          keyboardType="email-address"
                          autoCapitalize="none"
                          autoComplete="off"
                          autoCorrect={false}
                          textContentType="oneTimeCode"
                          onFocus={() => setIsFocusedEmail(true)}
                          onBlur={() => setIsFocusedEmail(false)}
                        />
                        {/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          email
                        ) ? (
                          <FontAwesome
                            name="check"
                            color={color.successPrimary}
                            size={22}
                            style={{
                              backgroundColor: color.surface,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: [{ translateY: -14 }],
                              padding: 4,
                              paddingHorizontal: 12
                            }}
                          />
                        ) : (
                          email &&
                          !isFocusedEmail && (
                            <FontAwesome
                              name="remove"
                              color={color.errorPrimary}
                              size={22}
                              style={{
                                backgroundColor: color.surface,
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: [{ translateY: -14 }],
                                padding: 4,
                                paddingHorizontal: 12
                              }}
                            />
                          )
                        )}
                      </View>
  
                      {/* Password Input */}
                      <View style={styles.inputWithIcon}>
                        <TextInput
                          style={styles.input}
                          placeholder="Lösenord"
                          onChangeText={(text) => {
                            setPassword(text);
                          }}
                          secureTextEntry={true}
                          autoComplete="off"
                          autoCorrect={false}
                          textContentType="oneTimeCode"
                          onFocus={() => setIsFocusedPass(true)}
                          onBlur={() => setIsFocusedPass(false)}
                        />
                        {password.length >= 8 ? (
                          <FontAwesome
                            name="check"
                            color={color.successPrimary}
                            size={22}
                            style={{
                              backgroundColor: color.surface,
                              position: 'absolute',
                              right: 6,
                              top: '50%',
                              transform: [{ translateY: -14 }],
                              padding: 4,
                              paddingHorizontal: 12
                            }}
                          />
                        ) : (
                          password &&
                          !isFocusedPass && (
                            <FontAwesome
                              name="remove"
                              color={color.errorPrimary}
                              size={22}
                              style={{
                                backgroundColor: color.surface,
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: [{ translateY: -14 }],
                                padding: 4,
                                paddingHorizontal: 12
                              }}
                            />
                          )
                        )}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              )}
            </Animated.View>
  
            {/* Footer with action buttons */}
            <View style={[styles.footer]}>
              <View style={styles.footerContent}>
                <View style={styles.buttonContainerStart}>
                  {step === 0 && (
                    <TeoButton
                      title="Fortsätt"
                      onPress={handleForward}
                      primary
                      loading={isLoadingALittle}
                      disabled={preferredUsername === ''}
                    />
                  )}
  
                  {step === 1 && (
                    <TeoButton
                      title="Enable Notifications"
                      onPress={() => handleNotificationPermission(true)}
                      primary
                    />
                  )}
  
                  {step === 2 && (
                    <TeoButton
                      title="Skapa konto"
                      onPress={() =>
                        handleSignUpAndRedirect(email, password, preferredUsername)
                      }
                      primary
                      loading={isLoadingALittle}
                      disabled={
                        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                          email
                        ) || password.length < 8
                      }
                    />
                  )}
  
                  {/* Skip introduction if on step 0 */}
                  {step === 0 && (
                    <TouchableOpacity
                      onPress={() => createGuestUser()}
                      style={styles.loginContainer}
                    >
                      <Text style={styles.primaryText}>Skippa Introduktion</Text>
                    </TouchableOpacity>
                  )}
  
                  {/* Maybe later for notifications if on step 1 */}
                  {step === 1 && (
                    <TouchableOpacity
                      onPress={() => handleNotificationPermission(false)}
                      style={styles.loginContainer}
                    >
                      <Text style={styles.primaryText}>Maybe Later</Text>
                    </TouchableOpacity>
                  )}
  
                  {/* Terms & Policy link if on step 2 */}
                  {step === 2 && (
                    <View style={styles.loginContainer}>
                      <TouchableOpacity
                        onPress={async () => {
                          const url =
                            'https://eminent-moat-c68.notion.site/Villkor-Integritetspolicy-Teo-9c9dad90f3714c23a3ba49c9950f8830?pvs=4';
                          try {
                            if (await InAppBrowser.isAvailable()) {
                              await InAppBrowser.open(url, {
                                dismissButtonStyle: 'cancel',
                                preferredBarTintColor: '#FFF',
                                preferredControlTintColor: 'black',
                                readerMode: false,
                                animated: true,
                                modalPresentationStyle: 'fullScreen',
                                modalTransitionStyle: 'coverVertical',
                                modalEnabled: true,
                                enableBarCollapsing: false,
                                showTitle: true,
                                toolbarColor: '#FFF',
                                secondaryToolbarColor: 'black',
                                navigationBarColor: 'black',
                                navigationBarDividerColor: 'white',
                                enableUrlBarHiding: true,
                                enableDefaultShare: true,
                                forceCloseOnRedirection: false
                              });
                            } else {
                              // If InAppBrowser isn't available, fallback:
                              Linking.openURL(url);
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }}
                      >
                        <Text style={styles.mutedText}>
                          Genom att logga in godkänner du våra{' '}
                          <Text style={styles.primaryText}>
                            villkor & integritetspolicy
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };
  
  export default Onboarding;
  