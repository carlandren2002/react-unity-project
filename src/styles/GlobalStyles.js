import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from '../ThemeContext';

const { width, height } = Dimensions.get('window');

// Base font size and rem calculation
const baseFontSize = 14;
const rem = (size) => {
  const scale = width / 30;
  return (size * scale) / baseFontSize;
};

const fontSizes = {
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  extraLarge: 22,
  veryLarge: 26,
  huge: 32,
  massive: 52,
};

// Colors
const COLORS = {
  light: {
    background: 'rgba(243,243,243,1)',
    bgTransparent: 'rgba(243,243,243,0)',
    primary: 'rgba(28,73,255,1)',
    onPrimary: 'rgba(255,255,255,1)',
    onPrimary50: 'rgba(255,255,255,0.5)',
    secondary: 'rgba(221,228,255,1)',
    onSecondary: 'rgba(27,75,255,1)',
    disabled: 'rgba(135,159,249,1)',
    onDisabled: 'rgba(247,250,249,1)',
    disabled2: 'rgba(220,224,228,1)',
    onDisabled2: 'rgba(255,255,255,1)',
    surface: 'rgba(255,255,255,1)',
    errorPrimary: 'rgba(227,74,107,1)',
    errorSecondary: 'rgba(251,227,233,1)',
    successPrimary: 'rgba(40,193,148,1)',
    successSecondary: 'rgba(224,246,239,1)',
    text: 'rgba(0,0,0,1)',
    mutedText: 'rgba(126,126,126,1)',
    border: 'rgba(206,206,206,1)',
    progressBarBackground: 'rgba(231,231,231,1)',
    locked: 'rgba(206,206,206,0.3)',
    next: 'rgba(255,255,255,1)',
    done: 'rgba(255,255,255,1)',
    tabBar: 'xlight',
    iconGul: 'rgba(248,204,109,1)',
    iconSilver: 'rgba(171,181,191,1)',
    iconLila: 'rgba(143,105,238,1)',
  },
  dark: {
    // TODO : define dark palette
  }
};
// Common styles
const commonStyles = {
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredHorizontal: {
    alignItems: 'center',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

const useStyles = () => {
  const { theme } = useTheme();
  const color = COLORS['light']; // Switch to COLORS[theme]

  const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: color.background,
    },
    containerTree: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: width * 0.70,
      marginLeft: width * 0.15,
      marginBottom: height * 0.01,
    },
    container: {
      flex: 1,
      backgroundColor: color.background,
    },
    content: {
      width: width * 0.8,
      marginHorizontal: (width - (width * 0.8)) / 2
    },
    contentWide: {
      width: width * 0.85,
      marginHorizontal: (width - (width * 0.85)) / 2
    },
    ball: {
      width: width * 0.05,
      height: width * 0.05,
      marginLeft: (width - (width * 0.05)) / 2,
      backgroundColor: color.lightGreen,
      ...commonStyles.centered,
      top: height * 0.005,
      borderRadius: width * 0.005,
      transform: [{ rotate: '45deg' }],
    },
    test: {
      top: -height * 0.01,
      width: width * 0.8,
      marginLeft: width * 0.1,
      marginBottom: rem(50),
      marginVertical: rem(30),
      backgroundColor: '#fff',
      alignItems: 'center',
      borderRadius: width * 0.03,
    },
    circle: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: 30,
      borderColor: color.background,
      zIndex: 10,
      backgroundColor: color.accent,
      position: 'absolute',
    },
    rowView: {
      zIndex: 5,
      position: 'absolute',
      height: height * 0.069,
      left: width * 0.035,
      right: width * 0.035,
      backgroundColor: color.yellow,
      width: width * 0.35,
      ...commonStyles.centered,
      borderRadius: width * 100,
    },
    verticalRow: {
      zIndex: 5,
      position: 'absolute',
      height: height * 0.16,
      width: height * 0.069,
      backgroundColor: color.yellow,
    },
    titleContainer: {
      zIndex: 3,
      pointerEvents: 'none',
      position: 'absolute',
      marginTop: rem(150),
      width: width * 0.7,
      left: width * 0.15,
      ...commonStyles.centered,
    },
    progressContainer: {
      borderRadius: 9999,
      backgroundColor: '#FFF2D2',
      zIndex: 1000,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: rem(10),
      paddingHorizontal: rem(16),
      marginBottom: rem(60),
    },
    loadingContainer: {
      ...commonStyles.absoluteFill,
      ...commonStyles.centered,
      zIndex: 1000,
      backgroundColor: color.background,
      pointerEvents: 'none',
    },
    topGradient: {
      ...commonStyles.absoluteFill,
      height: height * 0.05,
      zIndex: 500,
      pointerEvents: 'none',
    },
    button: {
      padding: Platform.OS === 'ios' ? rem(16) : rem(16),
      marginVertical: rem(5),
      borderRadius: rem(17),
      flexGrow: 1,
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonLoaderIcon: {
      width: rem(35),
      height: rem(35),
    },
    loaderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '400',
      backgroundColor: color.surface,
      color: '#717A88',
      textAlign: 'center',
      marginVertical: rem(9),
      width: '100%',
      padding: Platform.OS === 'ios' ? rem(15) : rem(12),
      borderRadius: rem(16),
    },
    text: {
      textAlign: 'center',
      fontSize: fontSizes.medium,
      fontWeight: Platform.OS === 'ios' ? '400' : '500',
      color: color.text,
    },
    primaryText: {
      textAlign: 'center',
      fontSize: fontSizes.medium,
      fontWeight: Platform.OS === 'ios' ? '400' : '500',
      color: color.primary,
    },
    mutedText: {
      textAlign: 'center',
      fontSize: fontSizes.medium,
      fontWeight: '400',
      color: color.mutedText,
    },
    notPrimaryText: {
      textAlign: 'center',
      fontSize: fontSizes.medium,
      fontWeight: Platform.OS === 'ios' ? '600' : '700',
    },
    buttonText: {
      fontSize: fontSizes.medium,
      fontWeight: '500',
      color: color.onPrimary,
    },
    bottomButtonText: {
      fontSize: fontSizes.medium,
      fontWeight: '500',
      color: color.surface,
    },
    progressText: {
      color: color.secondary,
      fontWeight: 'bold',
      fontSize: fontSizes.large,
    },
    littleMutedText: {
      textAlign: 'center',
      color: color.mutedText,
      fontSize: fontSizes.small,
    },
    imageStyle: {
      width: rem(28),
      height: rem(28),
      marginRight: rem(10),
    },
    backgroundImage: {
      ...commonStyles.absoluteFill,
    },
    keyboardView: {
      flex: 1
    },
    flexContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
    contentLogin: {
      flexDirection: 'row',
      width: width
    },
    contentRow: {
      flex: 1,
      flexDirection: 'row'
    },
    buttonContainer: {
      marginBottom: rem(10),
      width: '80%',
      alignSelf: 'center'
    },
    bottomButtonContainer: {
      width: '100%',
      alignSelf: 'center',
      position: 'absolute',
      bottom: 0,
      marginBottom: rem(0),
    },
    titleStartScreen: {
      fontSize: fontSizes.huge,
      textAlign: 'center',
      fontWeight: Platform.OS === 'ios' ? '700' : '800',
      color: color.text,
      marginBottom: rem(10),
    },
    startScreenLogo: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: rem(130),
    },
    subtitleStartScreen: {
      textAlign: 'center',
      fontSize: rem(20),
      color: color.text,
    },
    nextLesson: {
      backgroundColor: color.white,
      width: '84%',
      height: 70,
      borderRadius: rem(30),
      alignSelf: 'center',
      marginTop: rem(10),
      marginBottom: rem(7),
      padding: rem(23),
      paddingHorizontal: rem(26),
    },
    headerBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '84%',
      marginLeft: '8%',
    },
    bottom: {
      position: 'absolute',
      bottom: 28,
      width: '80%',
      alignItems: 'center',
      marginHorizontal: 42,
      justifyContent: 'center',
    },
    containerGameView: {
      flex: 1,
    },
    containerSimulate: {
      marginTop: 200,
      alignItems: 'center'
    },
    buttonTest: {
      backgroundColor: '#007BFF',
      padding: 10,
      marginVertical: 8,
      borderRadius: 5,
      width: 250,
      alignItems: 'center'
    },
    topGradientGameView: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 200,
      pointerEvents: 'none',
      zIndex: 2,
    },
    smallTopGradientGameView: {
      position: 'absolute',
      left: 0,
      right: 0,
      height: 100,
      pointerEvents: 'none',
      zIndex: 2,
    },
    smallBottomGradientGameView: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 200,
      pointerEvents: 'none',
      zIndex: -1,
    },
    unityView: {
      flex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    overlayBox: {
      position: 'absolute',
      zIndex: 500,
      bottom: 50,
      alignSelf: 'center',
      backgroundColor: color.surface,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    objectiveContainer: {
      position: 'absolute',
      zIndex: 500,
      top: 10,
      left: rem(20),
      right: rem(20),
      backgroundColor: 'rgba(136, 214, 113, 0)',
      paddingVertical: rem(18),
      paddingHorizontal: rem(18),
      textAlign: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    overlayContent: {
      backgroundColor: 'white',
      borderRadius: rem(16),
      width: '80%',
      paddingHorizontal: 20,
      paddingVertical: 18,
      paddingTop: 35,
      alignItems: 'center',
      margin: 40,
    },
    overlayTextHeader: {
      color: 'rgba(0, 0, 0, 1)',
      marginTop: rem(10),
      marginBottom: rem(7),
      textAlign: 'center',
      fontWeight: '600',
      fontSize: 20,
    },
    overlayText: {
      color: 'rgba(103, 113, 129, 1)',
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 16,
    },
    overlayButtons: {
      flexDirection: 'column',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: rem(20),
      gap: 15,
    },
    overlayButton: {
      borderRadius: rem(20),
      padding: 10,
      elevation: 2,
      backgroundColor: '#2196F3',
      minWidth: 100,
    },
    overlayButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    closeIcon: {
      position: 'absolute',
      padding: rem(20),
      top: rem(0),
      right: rem(0),
    },
    bottomSuccessSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      zIndex: 1000,
      backgroundColor: color.successSecondary,
      borderTopLeftRadius: rem(20),
      borderTopRightRadius: rem(20),
      padding: rem(35),
    },
    bottomSuccessSheetContent: {
      flex: 1,
    },
    bottomSuccessSheetTitle: {
      fontSize: 20,
      color: color.successPrimary,
      fontWeight: 'bold',
    },
    bottomSuccessSheetText: {
      fontSize: fontSizes.large,
      color: color.successPrimary,
      marginBottom: 20,
    },
    bottomCorrectIs: {
      marginTop: rem(10),
      fontSize: fontSizes.medium,
      color: color.errorPrimary,
    },
    bottomErrorSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      zIndex: 1000,
      backgroundColor: color.errorSecondary,
      borderTopLeftRadius: rem(20),
      borderTopRightRadius: rem(20),
      padding: rem(35),
    },
    bottomErrorSheetContent: {
      flex: 1,
    },
    bottomErrorSheetTitle: {
      fontSize: 20,
      color: color.errorPrimary,
      fontWeight: 'bold',
    },
    bottomErrorSheetText: {
      fontSize: fontSizes.large,
      color: color.errorPrimary,
      marginBottom: 20,
    },
    textContainerL: {
      marginTop: 'auto',
      paddingBottom: rem(40),
      alignItems: 'center',
    },
    hugeTitle: {
      fontSize: fontSizes.huge,
      paddingBottom: rem(5),
      fontWeight: '500',
      color: color.text,
    },
    title: {
      fontSize: fontSizes.extraLarge,
      paddingBottom: rem(5),
      fontWeight: 'bold',
      color: color.text,
    },
    massiveTitle: {
      fontSize: fontSizes.massive,
      paddingBottom: rem(5),
      color: color.text,
    },
    titleThinBig: {
      fontSize: fontSizes.veryLarge,
      paddingBottom: rem(10),
      fontWeight: '500',
      color: color.text,
    },
    smallTitle: {
      fontSize: fontSizes.large,
      paddingBottom: rem(5),
      fontWeight: 'bold',
      color: color.text,
    },
    smallSubTitle: {
      fontSize: fontSizes.small,
      color: color.mutedText,
      textAlign: 'center',
    },
    subTitle: {
      fontSize: fontSizes.medium,
      color: color.text,
      textAlign: 'center',
    },
    link: {
      fontSize: fontSizes.medium,
      color: color.primary,
      textAlign: 'center',
    },
    errorTextL: {
      color: 'red',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 10,
    },
    icon: {
      padding: 10,
    },
    codeFieldRoot: {
      zIndex: 500,
      paddingTop: 30
    },
    progressBarContainer: {
      zIndex: 901,
      height: Platform.OS === 'ios' ? 100 : 80,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: color.background,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      columnGap: 25,
    },
    iconContainer: {
      padding: 5,
    },
    close: {
      marginRight: 0,
    },
    backgroundProgressBar: {
      flex: 1,
      height: rem(17),
      backgroundColor: color.progressBarBackground,
      borderRadius: 50,
    },
    progressBar: {
      height: rem(16),
      backgroundColor: color.primary,
      borderRadius: 50,

    },
    image: {
      width: 100,
      height: 100,
      transform: [
        { translateX: 22 },
        { rotate: '66deg' },
      ],
      opacity: 0.4,
    },
    errorBox: {
      width: '100%',
      padding: rem(10),
      borderRadius: 8,
      marginBottom: rem(12),
      alignSelf: 'center',
    },
    errorTitle: {
      fontSize: fontSizes.medium,
      marginBottom: 5,
      fontWeight: '700',
      color: color.errorPrimary,
    },
    errorMessage: {
      fontSize: fontSizes.medium,
      color: color.errorPrimary,
      textAlign: 'center',
    },
    wrapper: {},
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    gradient1: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: -70,
      height: '60%',
      zIndex: 1,
    },
    gradient2: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: '20%',
      zIndex: 1,
    },
    imageSwiper1: {
      width: '100%',
      resizeMode: 'contain',
      transform: [{ translateY: 40 }],
    },
    imageSwiper2: {
      width: '80%',
      resizeMode: 'contain',
      transform: [{ translateY: -100 }],
    },
    titleSwiper: {
      position: 'absolute',
      fontSize: fontSizes.huge,
      fontWeight: 'bold',
      textAlign: 'center',
      bottom: 40,
      width: '80%',
      color: color.text,
      zIndex: 2,
    },
    dot: {
      backgroundColor: color.border,
      top: 80,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
    activeDot: {
      backgroundColor: color.mutedText,
      top: 80,
      width: 8,
      height: 8,
      borderRadius: 4,
      marginLeft: 3,
      marginRight: 3,
    },
    footer: {
      alignItems: 'center',
    },
    footerContent: {
      width: '80%',
      alignItems: 'center',
    },
    swipeText: {
      textAlign: 'center',
      bottom: 20,
      color: color.mutedText,
    },
    buttonContainerStart: {
      width: '100%',
    },
    loginContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      gap: Platform.OS === 'ios' ? 5 : 0,
    },
    customList: {
      backgroundColor: color.surface,
      marginVertical: rem(20),
      borderRadius: rem(20),
      overflow: 'hidden',
    },
    notificationList: {
      backgroundColor: color.surface,
      marginTop: rem(20),
      borderRadius: rem(20),
      overflow: 'hidden',
    },
    createAccountSurface: {
      borderRadius: rem(20),
      alignItems: 'center',
      width: '85%',
      paddingHorizontal: 25,
      marginBottom: 50,
    },
    createAccountSurfaceButton: {
      borderRadius: rem(20),
      flex: 1,
      width: '100%',
      paddingTop: 20
    },
    customListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: rem(20),
    },
    notificationListItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: rem(20),
    },
    customListIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: rem(18),
    },
    customListTextContainer: {
      flex: 1,
    },
    customListTitle: {
      fontSize: fontSizes.medium,
      color: color.text,
      fontWeight: 'bold',
    },
    customListTitleRed: {
      fontSize: fontSizes.medium,
      color: color.errorPrimary,
      fontWeight: 'bold',
    },
    customListSubtitle: {
      fontSize: fontSizes.regular,
      color: color.mutedText,
    },
    customListSeparator: {
      height: 0.5,
      backgroundColor: '#E0E0E0',
    },
    inputContainer: {
      position: 'relative',
    },
    validationIcon: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -10 }],
    },
    containerChapter: {
      flex: 1,
    },
    scrollContainerChapter: {
      paddingHorizontal: 32,
    },
    lessonTitleChapter: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    lessonDescriptionChapter: {
      fontSize: 16,
      color: '#666',
      marginBottom: 16,
    },
    titleChapter: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subtitleChapter: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 12,
      marginBottom: 6,
    },
    paragraphChapter: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12,
    },
    imageContainerChapter: {
      alignItems: 'center',
      marginVertical: 12,
    },
    imageChapter: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: rem(20),
    },
    captionChapter: {
      fontSize: 14,
      color: '#888',
      marginTop: 4,
    },
    cardChapter: {
      backgroundColor: color.surface,
      padding: 32,
      borderRadius: rem(20),
      marginVertical: 12,
    },
    cardTitleChapter: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    cardTextChapter: {
      fontSize: 14,
    },
    listChapter: {
      marginVertical: 12,
    },
    listItemChapter: {
      fontSize: 16,
      marginBottom: 4,
    },
    quoteContainer: {
      borderLeftWidth: 4,
      borderLeftColor: '#ccc',
      paddingLeft: 12,
      marginVertical: 12,
    },
    quoteTextChapter: {
      fontSize: 16,
      fontStyle: 'italic',
      marginBottom: 4,
    },
    quoteAuthorChapter: {
      fontSize: 14,
      textAlign: 'right',
      color: '#666',
    },
    containerQuiz: {
      flexGrow: 1,
      alignItems: 'center',
    },
    questionText: {
      fontSize: 18,
      marginTop: rem(10),
      marginBottom: rem(40),
      width: '88%',
    },
    altButton: {
      width: '88%',
      padding: rem(22),
      marginVertical: rem(8),
      borderRadius: rem(16),
      backgroundColor: '#DDE4FF',
      borderWidth: 2,
      borderColor: 'transparent',
      alignItems: 'left',
    },
    altText: {
      color: '#1848FF',
      fontSize: fontSizes.medium,
      fontWeight: '500'
    },
    feedbackText: {
      fontSize: 18,
      marginTop: 20,
      textAlign: 'center',
      color: '#555',
    },
    resultText: {
      fontSize: 28,
      marginBottom: 20,
      textAlign: 'center',
    },
    explanationContainer: {
      width: '88%',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: rem(22),
      marginTop: rem(30),
      paddingVertical: rem(30),
      marginVertical: 16, 
    },
    explanationTitleContainer: {
      position: 'absolute',
      top: -10,
      left: 0, 
      right: 0, 
      justifyContent: 'center', 
      alignItems: 'center',
    },
    explanationTitleParent: {
      backgroundColor: color.secondary,
      paddingHorizontal: 25,
      paddingVertical: 5,
      borderRadius: 10,
    },
    explanationTitle: {
      fontSize: fontSizes.small,
      color: color.onSecondary,
      fontWeight: 'bold',
    },
    explanationText: {
      fontSize: 16,
      color: '#555',
    },
    arrow:{
      
    }
  })
  return { styles, color };
};

export default useStyles;
