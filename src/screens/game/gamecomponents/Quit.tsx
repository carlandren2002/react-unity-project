import React from 'react';
import { Alert } from 'react-native';

interface QuitProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Shows an alert dialog when the user tries to quit the lesson.
 * If the user chooses to quit, the onConfirm callback is called.
 * If the user chooses to cancel, the onClose callback is called.
 * @param {{ visible: boolean, onClose: () => void, onConfirm: () => void }} props
 * @returns {JSX.Element | null}
 */
const Quit: React.FC<QuitProps> = ({ visible, onClose, onConfirm }) => {
  React.useEffect(() => {
    if (visible) {
      Alert.alert(
        'Avsluta lektion?',
        'Dina framsteg sparas inte',
        [
          {
            text: 'Avbryt',
            onPress: onClose,
            style: 'cancel',
          },
          {
            text: 'Avsluta',
            onPress: onConfirm,
            style: 'destructive',
          },
        ],
        { cancelable: false }
      );
    }
  }, [visible, onClose, onConfirm]);

  return null;
};

export default Quit;