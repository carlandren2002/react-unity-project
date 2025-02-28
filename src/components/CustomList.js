import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ListItem = ({ icon, color, redTitle, title, subtitle, onPress, styles }) => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.customListItem}>
      <View style={[styles.customListIconContainer, { backgroundColor: color }]}>
        <Icon name={icon} size={20} color="white" />
      </View>
      <View style={[
        styles.customListTextContainer,
        !subtitle && styles.customListTextContainerCentered
      ]}>
        <Text style={redTitle ? styles.customListTitleRed : styles.customListTitle}>{title}</Text>
        {subtitle ? (
          <Text style={styles.customListSubtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  </TouchableOpacity>
);

const CustomList = ({ items, styles }) => (
  <View style={styles.customList}>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ListItem {...item} styles={styles} />
        {index < items.length - 1 && <View style={styles.customListSeparator} />}
      </React.Fragment>
    ))}
  </View>
);

export default CustomList;