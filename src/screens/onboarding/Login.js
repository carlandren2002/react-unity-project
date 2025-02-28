import React, {
  useState,
  useCallback,
  useContext
} from 'react';
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ProgressBar, { heightOfProgressBar } from '../../components/Header';
import Button from '../../components/Button';
import useStyles from '../../styles/GlobalStyles';
import { AuthContext } from '../../AuthContext';
import { I18n } from 'aws-amplify/utils';
import ErrorBox from '../../components/ErrorBox';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const { width: deviceWidth } = Dimensions.get('window');

/**
 * Login component for handling user sign-in.
 *
 * @component
 * @returns {JSX.Element}
 */
const Login = () => {
  const { styles, color } = useStyles();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [step, setStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Fields for user credentials and error handling
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  // Focus state for email and password inputs (used for icon logic)
  const [isFocusedPass, setIsFocusedPass] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);

  // AuthContext for signing in and loading state
  const { handleSignIn, isLoadingALittle } = useContext(AuthContext);

  // Reanimated values
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  /**
   * Performs a sliding transition between steps (not heavily used here, but kept for potential multi-step forms).
   *
   * @function handleTransition
   * @param {number} direction - The direction of the transition (1 for forward, -1 for backward).
   */
  const handleTransition = useCallback(
    (direction) => {
      if (isAnimating) return;
      Keyboard.dismiss();

      const newStep = step + direction;

      // Only proceed if new step is valid (0 or 1)
      if (newStep >= 0 && newStep <= 1) {
        setIsAnimating(true);
        setStep(newStep);

        translateX.value = withSpring(
          translateX.value - direction * deviceWidth,
          { damping: 100, stiffness: 160 },
          (finished) => {
            if (finished) {
              runOnJS(setIsAnimating)(false);
            }
          }
        );

        // Toggle opacity based on current step
        opacity.value = withSpring(newStep === 0 ? 1 : 0);
      }
    },
    [isAnimating, step, translateX, opacity]
  );

  /**
   * Navigates backward in the flow, or returns to StartScreen if on the first step.
   *
   * @function handleBackwards
   */
  const handleBackwards = useCallback(() => {
    if (step === 0) {
      navigation.navigate('StartScreen');
    } else {
      handleTransition(-1);
    }
  }, [step, navigation, handleTransition]);

  /**
   * Navigates forward in the flow (though only one step is used here for login).
   *
   * @function handleForward
   */
  const handleForward = useCallback(() => {
    handleTransition(1);
  }, [handleTransition]);

  /**
   * Handles the sign-in process. Attempts to sign in with the given email and password,
   * then proceeds to the next step if successful. Otherwise, displays an error message.
   *
   * @async
   * @function handleSignInAndRedirect
   * @param {string} email - User's email address.
   * @param {string} password - User's password.
   * @returns {Promise<void>}
   */
  const handleSignInAndRedirect = async (email, password) => {
    setErrorMessage(null);

    if (errorMessage) {
      setIsAnimatingOut(true);
      setErrorMessage(null);
    }

    try {
      await handleSignIn(email, password);
      handleForward();
    } catch (error) {
      // Handle known Cognito error messages
      if (error.name && error.name === 'InvalidPasswordException') {
        setErrorMessage(I18n.get('Password must be at least 8 characters long'));
      } else if (error.name && error.name === 'InvalidParameterException') {
        setErrorMessage(I18n.get('Ange en giltlig e-postadress'));
      } else {
        setErrorMessage(I18n.get(error.message));
      }
    }

    // Reset error animation state after a delay
    setTimeout(() => {
      setIsAnimatingOut(false);
    }, 600);
  };

  /**
   * Animated style for horizontal slide transitions.
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  /**
   * Animated style for controlling button opacity.
   */
  const buttonStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }));

  /**
   * Renders each step of the form in an Animated.View.
   *
   * @function renderStep
   * @param {number} index - Step index.
   * @param {JSX.Element} content - Content to be rendered for that step.
   * @returns {JSX.Element}
   */
  const renderStep = (index, content) => (
    <Animated.View key={index}>
      {content}
    </Animated.View>
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ProgressBar
        onClose={handleBackwards}
        noBar
        border={1}
        title={step === 0 ? 'Logga in' : 'Bekräfta E-post'}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'height' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.flexContainer}>
          {/* Slide-In Content */}
          <Animated.View
            style={[styles.contentRow, animatedStyle, { marginTop: heightOfProgressBar }]}
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
                  ref={(ref) => {
                    this.scrollView = ref;
                  }}
                  onContentSizeChange={() =>
                    this.scrollView.scrollToEnd({ animated: true })
                  }
                >
                  <View style={styles.textContainerL}>
                    <Text style={styles.title}>Välkommen tillbaka!</Text>
                  </View>

                  {/* ErrorBox for displaying login errors */}
                  {(errorMessage || isAnimatingOut) && (
                    <ErrorBox
                      error={errorMessage}
                      title="Hoppsan!"
                      isAnimatingOut={isAnimatingOut}
                    />
                  )}

                  {/* Email Input */}
                  <View style={styles.inputWithIcon}>
                    <TextInput
                      style={styles.input}
                      placeholder="E-post"
                      onChangeText={(text) => setEmail(text)}
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
                      onChangeText={(text) => setPassword(text)}
                      secureTextEntry
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
                </ScrollView>
              </View>
            )}
          </Animated.View>

          {/* Footer Section */}
          <View style={[styles.footer]}>
            <View style={styles.footerContent}>
              <View style={styles.buttonContainerStart}>
                {/* Login Button */}
                <Button
                  title="Logga in"
                  onPress={() => {
                    Keyboard.dismiss();
                    handleSignInAndRedirect(email, password);
                  }}
                  loading={isLoadingALittle}
                  primary
                  disabled={
                    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                      email
                    ) || password.length < 8
                  }
                />

                {/* Forgot Password Navigation */}
                <TouchableOpacity
                  onPress={() => navigation.navigate('Request Reset')}
                  style={styles.loginContainer}
                >
                  <Text style={styles.primaryText}>Glömt ditt lösenord?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
