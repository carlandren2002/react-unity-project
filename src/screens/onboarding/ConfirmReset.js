import React, { useState, useContext } from 'react';
import { View, Alert } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useStyles from '../../styles/GlobalStyles';
import Header2, { heightOfProgressBar } from '../../components/Header2';
import Button from '../../components/Button';
import { AuthContext } from '../../AuthContext';

/**
 * ConfirmReset component.
 * Allows the user to confirm their password reset by entering the verification code
 * and new password provided via email.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.route - The route object containing the user email from the previous screen.
 * @returns {JSX.Element}
 */
const ConfirmReset = ({ route }) => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { isLoadingALittle, confirmForgotPassword } = useContext(AuthContext);
  const { email } = route.params;

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  /**
   * Handles the update of the verification code input.
   *
   * @function handleCodeChange
   * @param {string} text - The updated text for the verification code.
   */
  const handleCodeChange = (text) => {
    setCode(text);
  };

  /**
   * Handles the update of the new password input.
   *
   * @function handleNewPasswordChange
   * @param {string} text - The updated text for the new password.
   */
  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  /**
   * Confirms the password reset by calling confirmForgotPassword from AuthContext.
   * If successful, alerts the user and navigates back two screens. On failure, displays an error alert.
   *
   * @async
   * @function handleConfirmReset
   */
  const handleConfirmReset = async () => {
    if (!code || !newPassword) {
      Alert.alert(
        'Error',
        'Please enter both the verification code and new password.'
      );
      return;
    }

    try {
      await confirmForgotPassword(email, newPassword, code);
      Alert.alert('Success', 'Your password has been reset successfully.');
      navigation.pop(2); // Navigate back two steps
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password. Please try again.');
      console.error('Error confirming password reset:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Header2
        title="Confirm Password Reset"
        showChevron
        onChevronPress={() => navigation.goBack()}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentWide,
          {
            paddingTop: heightOfProgressBar,
            paddingBottom: insets.bottom
          }
        ]}
      >
        <TextInput
          style={styles.input}
          value={code}
          onChangeText={handleCodeChange}
          placeholder="Enter verification code"
          keyboardType="number-pad"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={handleNewPasswordChange}
          placeholder="Enter new password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title="Confirm Password Reset"
          primary
          loading={isLoadingALittle}
          onPress={handleConfirmReset}
          disabled={!code || !newPassword}
        />
      </ScrollView>
    </View>
  );
};

export default ConfirmReset;
