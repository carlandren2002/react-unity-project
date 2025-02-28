import React from 'react';
import { View, Text, Switch } from 'react-native';
import useStyles from '../styles/GlobalStyles';

/**
 * A single preference item with a toggle switch
 * @param {string} title - Label for the preference
 * @param {boolean} value - Current state of the toggle switch
 * @param {function} onValueChange - Callback when switch value changes
 */
const PreferenceListItem = ({ 
  title, 
  value = false, 
  onValueChange 
}) => {
  const { styles, color } = useStyles();

  return (
    <View style={styles.notificationListItem}>
      <Text style={styles.text}>{title}</Text>
      <Switch
        trackColor={{ 
          false: color.disabled, 
          true: color.primary 
        }}
        thumbColor={value ? color.onPrimary : color.onDisabled}
        ios_backgroundColor={color.disabled}
        onValueChange={onValueChange}
        value={value}
        accessible={true}
        accessibilityLabel={`${title} toggle switch`}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  );
};

/**
 * Renders a list of preference items with toggle switches
 * @param {Array} items - Array of preference item objects
 */
const NotificationPreferences = ({ items = [] }) => {
  const { styles } = useStyles();

  if (items.length === 0) {
    return null;
  }

  return (
    <View style={styles.notificationList}>
      {items.map((item, index) => (
        <React.Fragment key={`preference-item-${item.title || index}`}>
          <PreferenceListItem {...item} />
          {index < items.length - 1 && (
            <View style={styles.customListSeparator} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

// Export both components for flexibility
export { PreferenceListItem, NotificationPreferences };
export default NotificationPreferences;