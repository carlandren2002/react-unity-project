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
 * RequestReset component.
 * Allows users to enter their email address and request a password reset.
 *
 * @component
 * @returns {JSX.Element}
 */
const RequestReset = () => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const { isLoadingALittle, forgotPassword } = useContext(AuthContext);
  const [email, setEmail] = useState('');

  /**
   * Handles changes to the email text input.
   *
   * @function handleEmailChange
   * @param {string} text - The updated text for the email input.
   */
  const handleEmailChange = (text) => {
    setEmail(text);
  };

  /**
   * Handles the process of requesting a password reset.
   * Validates the input email and calls the AuthContext forgotPassword method.
   * If successful, navigates to the Confirm Reset screen with the entered email.
   *
   * @async
   * @function handleRequestReset
   */
  const handleRequestReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    try {
      await forgotPassword(email);
      Alert.alert(
        'Success',
        'A password reset email has been sent to your email address.'
      );
      navigation.navigate('Confirm Reset', { email });
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
      console.error('Error requesting password reset:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Header2
        title="Reset Password"
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
          value={email}
          onChangeText={handleEmailChange}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
        />
        <Button
          title="Request Password Reset"
          primary
          loading={isLoadingALittle}
          onPress={handleRequestReset}
          disabled={!email}
        />
      </ScrollView>
    </View>
  );
};

export default RequestReset;