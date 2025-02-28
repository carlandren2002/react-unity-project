import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, Alert } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import useStyles from '../../styles/GlobalStyles';
import Header2, { heightOfProgressBar } from '../../components/Header2';
import Button from '../../components/Button';
import { AuthContext } from '../../AuthContext';

/**
 * ChangeName component that enables the user to update their preferred username.
 *
 * @component
 * @returns {JSX.Element} Rendered ChangeName screen
 */
const ChangeName = () => {
  const { styles, color } = useStyles();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const { user, isLoadingALittle, updatePreferredUsername } = useContext(AuthContext);
  const [newName, setNewName] = useState('');
  const [isNameChanged, setIsNameChanged] = useState(false);

  useEffect(() => {
    if (user?.attributes?.preferred_username) {
      setNewName(user.attributes.preferred_username);
    }
  }, [user]);

  /**
   * Handles changes in the name input field, marking whether or not 
   * the name has changed from the current value.
   *
   * @param {string} text - The new name entered by the user.
   */
  const handleNameChange = useCallback((text) => {
    setNewName(text);
    setIsNameChanged(text !== user?.attributes?.preferred_username);
  }, [user]);

  /**
   * Handles the "Change Name" button press. It updates the user's
   * preferred username if it has changed, and alerts the user
   * on success or failure.
   *
   * @async
   * @function handleChangeName
   */
  const handleChangeName = async () => {
    if (!isNameChanged) return;

    try {
      await updatePreferredUsername(newName);
      Alert.alert('Success', 'Your name has been updated successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update name. Please try again.');
      console.error('Error updating name:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color.background }]}>
      <Header2
        title="Change Name"
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
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <TextInput
          style={styles.input}
          value={newName}
          onChangeText={handleNameChange}
          placeholder="Enter new name"
          autoCapitalize="words"
          autoComplete="name"
          autoCorrect={false}
        />
        <Button
          title="Change Name"
          primary
          loading={isLoadingALittle}
          onPress={handleChangeName}
          disabled={!isNameChanged}
        />
      </ScrollView>
    </View>
  );
};

export default ChangeName;