import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import useStyles from '../styles/GlobalStyles';

/**
 * Renders a single item in the profile list
 */
const ProfileListItem = ({ 
  title, 
  subtitle, 
  editable = false, 
  onEdit, 
  redTitle = false, 
  onPress 
}) => {
  const { styles, color } = useStyles();

  const handlePress = () => {
    // Special handling for Delete Account action
    if (redTitle && title === 'Delete Account') {
      Alert.alert(
        "Delete Account",
        "Are you sure you want to delete your account? This action is permanent and cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", onPress: onPress, style: "destructive" }
        ]
      );
    } else if (onPress) {
      onPress();
    }
  };

  const titleStyle = redTitle ? styles.customListTitleRed : styles.customListTitle;
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.customListItem}>
      <View style={styles.customListTextContainer}>
        <Text style={titleStyle}>{title}</Text>
        {subtitle && <Text style={styles.customListSubtitle}>{subtitle}</Text>}
      </View>
      
      {editable && (
        <TouchableOpacity onPress={onEdit}>
          <Text style={[styles.customListTitle, { color: color.primary }]}>Edit</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

/**
 * A list component used for Profile settings
 */
const ProfileList = ({ items = [] }) => {
  const { styles } = useStyles();

  return (
    <View style={styles.customList}>
      {items.map((item, index) => (
        <React.Fragment key={`profile-item-${index}`}>
          <ProfileListItem {...item} />
          {index < items.length - 1 && <View style={styles.customListSeparator} />}
        </React.Fragment>
      ))}
    </View>
  );
};

export { ProfileList, ProfileListItem };
export default ProfileList;