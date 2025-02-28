import React, { createContext, useEffect, useState } from 'react';
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  fetchAuthSession,
  fetchUserAttributes,
  deleteUser,
  updateUserAttributes,
  resetPassword,
  confirmResetPassword,
} from 'aws-amplify/auth';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18n } from 'aws-amplify/utils';
import { Platform, NativeModules } from 'react-native';

/**
 * Language mapping object for language code to language name.
 * Add more languages as needed.
 */
const languageMapping = {
  en: 'English',
  sv: 'Swedish',
  // Add more languages as needed
};

/**
 * Reverse mapping from language name to language code.
 */
const reverseLanguageMapping = Object.fromEntries(
  Object.entries(languageMapping).map(([code, name]) => [name, code])
);

export const AuthContext = createContext();

/**
 * AuthContextProvider component provides authentication context for the app.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} AuthContext.Provider component.
 */
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingALittle, setIsLoadingALittle] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('Swedish'); // Default to Swedish

  /**
   * Get the device language.
   *
   * @returns {string} The language name based on the device setting.
   */
  const getDeviceLanguage = () => {
    let deviceLang;
    if (Platform.OS === 'ios') {
      deviceLang =
        NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else {
      deviceLang = NativeModules.I18nManager.localeIdentifier;
    }
    const langCode = deviceLang.split('_')[0]; // Get the language code part
    return languageMapping[langCode] || 'English'; // Default to English if not found
  };

  /**
   * Set the language for the application.
   *
   * @param {string} langName - The name of the language to set.
   * @returns {Promise<void>}
   * @throws {Error} If the language name is invalid.
   */
  const setLanguage = async (langName) => {
    try {
      const langCode = reverseLanguageMapping[langName];
      if (!langCode) {
        throw new Error('Invalid language name');
      }
      await AsyncStorage.setItem('userLanguage', langName);
      I18n.setLanguage(langCode);
      setCurrentLanguage(langName);
    } catch (error) {
      console.error('Error setting language:', error);
    }
  };

  /**
   * Get the current language.
   *
   * @returns {string} The current language name.
   */
  const getLanguage = () => currentLanguage;

  /**
   * Get all available languages.
   *
   * @returns {string[]} Array of available language names.
   */
  const getAvailableLanguages = () => Object.values(languageMapping);

  useEffect(() => {
    /**
     * Initialize the language settings by checking stored language or using device language.
     */
    const initializeLanguage = async () => {
      try {
        const storedLang = await AsyncStorage.getItem('userLanguage');
        if (storedLang && languageMapping[reverseLanguageMapping[storedLang]]) {
          setLanguage(storedLang);
        } else {
          const deviceLang = getDeviceLanguage();
          setLanguage(deviceLang);
        }
      } catch (error) {
        console.error('Error initializing language:', error);
      }
    };

    initializeLanguage();
  }, []);

  /**
   * Check the current user's authentication status.
   *
   * Attempts to retrieve the user from AsyncStorage first; if not found, fetches from AWS.
   *
   * @returns {Promise<void>}
   */
  const checkUser = async () => {
    setIsLoading(true);
    try {
      // First, try to get the user from AsyncStorage
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        setIsLoading(false);
        return;
      }

      // If no stored user, proceed with the current logic
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const userAttributes = await fetchUserAttributes();
      const newUser = {
        ...currentUser,
        userId: session.identityId || currentUser.userId,
        attributes: userAttributes,
      };
      setUser(newUser);
      // Store the new user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      if (error.name === 'UserUnAuthenticatedException') {
        setUser(null);
        await AsyncStorage.removeItem('user');
      } else {
        console.error('Error checking user status:', error);
        setUser(null);
        await AsyncStorage.removeItem('user');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a guest user.
   *
   * @returns {Promise<void>}
   */
  const createGuestUser = async () => {
    const guestUser = {
      isGuest: true,
      userId: `guest-${Date.now()}`,
      attributes: {
        preferred_username: 'Guest',
      },
    };
    setUser(guestUser);
    await AsyncStorage.setItem('user', JSON.stringify(guestUser));
  };

  /**
   * Check for internet connection.
   *
   * @returns {Promise<boolean>} True if connected to the internet, else false.
   */
  const checkInternetConnection = async () => {
    const netInfo = await NetInfo.fetch();
    console.log(netInfo.isConnected);
    return netInfo.isConnected;
  };

  /**
   * Handle user sign in.
   *
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<boolean|void>} False if sign-up confirmation is required.
   * @throws {Error} If sign in fails.
   */
  const handleSignIn = async (email, password) => {
    setIsLoadingALittle(true);
    console.log('signIn');
    try {
      const currentUser = await signIn({ username: email, password });
      if (currentUser.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        return false;
      } else {
        await checkUser();
        // The user will be stored in AsyncStorage by checkUser()
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Handle user sign out.
   *
   * @returns {Promise<void>}
   * @throws {Error} If sign out fails.
   */
  const handleSignOut = async () => {
    setIsLoadingALittle(true);
    try {
      await signOut();
      console.log('signOut success');
      setUser(null);
      await AsyncStorage.clear();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Handle user sign up.
   *
   * If there is no internet connection, fallback to creating a guest user.
   *
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @param {string} preferredUsername - Preferred username.
   * @returns {Promise<void>}
   * @throws {Error} If sign up fails.
   */
  const handleSignUp = async (email, password, preferredUsername) => {
    setIsLoadingALittle(true);
    console.log('signUp');

    if (!(await checkInternetConnection())) {
      console.log('No internet connection, falling back to guest user.');
      await createGuestUser(); // Create guest user when offline
      setIsLoadingALittle(false);
      return;
    }

    try {
      const signUpResult = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            preferred_username: preferredUsername,
          },
        },
      });
      console.log(signUpResult);
      if (signUpResult.isSignUpComplete) {
        await handleSignIn(email, password);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Handle sign up confirmation.
   *
   * @param {string} email - User email.
   * @param {string} code - Confirmation code.
   * @param {string} password - User password.
   * @returns {Promise<void>}
   * @throws {Error} If confirmation fails.
   */
  const handleSignUpConfirmation = async (email, code, password) => {
    setIsLoadingALittle(true);
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });
      console.log(email, code, password);
      if (isSignUpComplete) {
        await handleSignIn(email, password);
      }
    } catch (e) {
      throw e;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Resend the sign up confirmation code.
   *
   * @param {string} email - User email.
   * @returns {Promise<void>}
   * @throws {Error} If resending the code fails.
   */
  const resendConfirmCode = async (email) => {
    setIsLoadingALittle(true);
    try {
      await resendSignUpCode({ username: email });
    } catch (e) {
      throw e;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Update the preferred username.
   *
   * @param {string} newUsername - New preferred username.
   * @returns {Promise<boolean>} True if update succeeds.
   * @throws {Error} If updating fails.
   */
  const updatePreferredUsername = async (newUsername) => {
    setIsLoadingALittle(true);
    try {
      // Check internet connection
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      // Update the preferred_username in AWS
      await updateUserAttributes({
        userAttributes: {
          preferred_username: newUsername,
        },
      });

      // Fetch updated user attributes
      const updatedAttributes = await fetchUserAttributes();

      // Update local user state
      const updatedUser = {
        ...user,
        attributes: {
          ...user.attributes,
          preferred_username: newUsername,
        },
      };
      setUser(updatedUser);

      // Update user in AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      console.log('Preferred username updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating preferred username:', error);
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Initiate the forgot password process.
   *
   * @param {string} username - The username for which to reset the password.
   * @returns {Promise<boolean>} True if the process initiates successfully.
   * @throws {Error} If the process fails.
   */
  const forgotPassword = async (username) => {
    setIsLoadingALittle(true);
    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      await resetPassword({ username });
      console.log('Password reset initiated successfully');
      return true;
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Confirm the forgot password process by setting a new password.
   *
   * @param {string} username - The username.
   * @param {string} newPassword - The new password.
   * @param {string} confirmationCode - The confirmation code.
   * @returns {Promise<boolean>} True if confirmation succeeds.
   * @throws {Error} If confirmation fails.
   */
  const confirmForgotPassword = async (username, newPassword, confirmationCode) => {
    setIsLoadingALittle(true);
    try {
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        throw new Error('No internet connection');
      }

      await confirmResetPassword({ username, newPassword, confirmationCode });
      console.log('Password reset confirmed successfully');
      return true;
    } catch (error) {
      console.error('Error confirming password reset:', error);
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  /**
   * Handle user deletion.
   *
   * @returns {Promise<void>}
   * @throws {Error} If user deletion fails.
   */
  const handleDeleteUser = async () => {
    setIsLoadingALittle(true);
    try {
      await deleteUser();
      console.log('User account deleted successfully');
      setUser(null);
      await AsyncStorage.clear();
      console.log('Async Cleared');
    } catch (error) {
      console.error('Error deleting user account:', error);
      throw error;
    } finally {
      setIsLoadingALittle(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isLoadingALittle,
        checkUser,
        createGuestUser,
        handleSignIn,
        handleSignUp,
        handleSignOut,
        handleSignUpConfirmation,
        updatePreferredUsername,
        resendConfirmCode,
        handleDeleteUser,
        setLanguage,
        getLanguage,
        currentLanguage,
        forgotPassword,
        confirmForgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
