import React from 'react';
import { View, TouchableOpacity, Platform, Text } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

import useStyles from '../styles/GlobalStyles';

export const heightOfProgressBar = Platform.OS === 'ios' ? 100 : 80;

type Header2Props = {
  title?: string;
  showChevron?: boolean;
  onChevronPress?: () => void;
  showCog?: boolean;
  onCogPress?: () => void;
  showFlag?: boolean;
  onFlagPress?: () => void;

};

/**
 * A header component that can display a title, a chevron to go back, and a cog
 * to enter settings.
 *
 * @param {string} [title=''] The title of the header.
 * @param {boolean} [showChevron=false] Whether to show the chevron to go back.
 * @param {() => void} [onChevronPress] The function to call when the chevron is
 * pressed.
 * @param {boolean} [showCog=false] Whether to show the cog to enter settings.
 * @param {() => void} [onCogPress] The function to call when the cog is pressed.
 * @param {boolean} [showFlag=false] Whether to show a flag icon.
 * @param {() => void} [onFlagPress] The function to call when the flag is pressed.
 * @returns {React.ReactElement} The header component.
 */
const Header2: React.FC<Header2Props> = ({
  title = '',
  showChevron = false,
  onChevronPress,
  showCog = false,
  onCogPress,
  showFlag = false,
  onFlagPress,
}) => {
  const { styles, color } = useStyles();
  const insets = useSafeAreaInsets();

  const containerStyle = [
    styles.progressBarContainer,
    { paddingTop: insets.top },
  ];

  const BackgroundComponent = Platform.OS === 'ios' ? BlurView : View;
  const backgroundStyle = Platform.OS === 'ios'
    ? { flex: 1, backgroundColor: 'transparent' }
    : { backgroundColor: color.background };

  return (
    <>
      <BackgroundComponent blurType="xlight" blurAmount={16} style={[containerStyle, backgroundStyle]}>
        <TouchableOpacity
          style={[styles.iconContainer, { opacity: showChevron ? 1 : 0, pointerEvents: showChevron ? 'auto' : 'none' }]}
          onPress={onChevronPress}
        >
          <FontAwesome5 style={styles.arrow} size={22} name="chevron-left" color={color.text} />
        </TouchableOpacity>

        <View style={[styles.backgroundProgressBar, { opacity: 0 }]}>
          <Animated.View style={styles.progressBar} />
        </View>

        {showCog &&
          <TouchableOpacity style={[styles.iconContainer, { opacity: showCog ? 1 : 0, pointerEvents: showCog ? 'auto' : 'none' }]}
            onPress={onCogPress}>
            <FontAwesome5 style={styles.arrow} size={20} name="cog" color={color.mutedText} />
          </TouchableOpacity>
        }
        {showFlag &&
          <TouchableOpacity style={[styles.iconContainer, { opacity: showFlag ? 1 : 0, pointerEvents: showFlag ? 'auto' : 'none' }]}
            onPress={onCogPress}>
            <FontAwesome6 style={styles.arrow} size={20} name="flag" color={color.mutedText} solid />
          </TouchableOpacity>
        }

      </BackgroundComponent>
      <View style={[containerStyle, { pointerEvents: 'none', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.text, { color: color.text, zIndex: 90000 }]}>{title}</Text>
      </View>
    </>
  );
};

export default Header2;

