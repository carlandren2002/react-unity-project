import React from 'react';

// React Native & Navigation Imports
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// AWS Amplify Imports
import { Amplify } from 'aws-amplify'; // V6
import { I18n } from 'aws-amplify/utils';
// docs: https://aws-amplify.github.io/amplify-js/api/modules/aws_amplify.auth_cognito.html
import amplifyConfig from './amplifyconfiguration.json';

// Local Contexts & Components
import { LessonContextProvider } from './LessonContext';
import { AuthContextProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { QuizProvider } from './QuizContext';
import AppNavigator from './navigation/AppNavigator';

Amplify.configure(amplifyConfig);

// TODO: Refactor the I18n implementation to enhance multi-language support.

I18n.setLanguage('sv');
I18n.putVocabularies({
  sv: {
    'Account recovery requires verified contact information':
      'För att fixa ditt konto behöver vi kolla att det verkligen är du',
    'Back to Sign In': 'Tillbaka till inloggningen, bättre lycka nästa gång!',
    'Change Password': 'Byt lösenord till något du faktiskt kommer ihåg',
    Changing: 'Fixar till det',
    Code: 'Hemlig kod',
    'Confirm Password': 'Bekräfta att du valt rätt lösenord',
    'Confirm Sign Up': 'Bekräfta att du vill hänga med oss',
    'Confirm SMS Code': 'Bekräfta SMS-koden, spännande grejer',
    'Confirm TOTP Code': 'Bekräfta TOTP-koden, lite high-tech',
    Confirm: 'Bekräfta och kör igång',
    'Confirmation Code': 'Bekräftelsekod',
    Confirming: 'Fixar det sista',
    'Create a new account': 'Skapa ett nytt konto och gör internet lite roligare',
    'Create Account': 'Skapa konto och sätt igång',
    'Creating Account': 'Fixar ditt nya konto',
    'Dismiss alert': 'Stäng varningen, vi har koll',
    Email: 'E-postadress',
    'Enter your code': 'Skriv in din hemliga kod',
    'Enter your Email': 'Fyll i din e-post, vi lovar att inte spamma',
    'Enter your phone number': 'Ange ditt telefonnummer',
    'Enter your username': 'Skriv in ditt coola användarnamn',
    'Forgot your password?': 'Glömt ditt lösenord? Ingen fara, det händer!',
    'Hide password': 'Göm lösenordet',
    'It may take a minute to arrive': 'Det kan ta en minut, håll ut!',
    Loading: 'Laddar',
    'New password': 'Skapa ett nytt lösenord',
    or: 'eller',
    Password: 'Lösenord',
    'Phone Number': 'Telefonnummer',
    'Resend Code': 'Skicka koden igen, för säkerhets skull',
    'Reset your password': 'Återställ ditt lösenord och börja om',
    'Reset your Password': 'Fixa nytt lösenord',
    'Send code': 'Skicka koden',
    'Send Code': 'Skicka kod',
    Sending: 'Skickar iväg det',
    'Setup TOTP': 'Fixa TOTP',
    'Show password': 'Visa lösenordet',
    'Sign in to your account': 'Logga in på ditt konto',
    'Sign In with Amazon': 'Logga in med Amazon',
    'Sign In with Apple': 'Logga in med Apple',
    'Sign In with Facebook': 'Logga in med Facebook',
    'Sign In with Google': 'Logga in med Google',
    'Sign in': 'Logga in',
    'Sign In': 'Logga in',
    'Signing in': 'Loggar in',
    Skip: 'Hoppa över',
    Submit: 'Skicka iväg',
    Submitting: 'Skickar',
    Username: 'Användarnamn',
    'Verify Contact': 'Bekräfta din kontaktinfo',
    Verify: 'Bekräfta',
    'We Sent A Code': 'Vi skickade en kod, kolla din inkorg',
    'We Texted You': 'Vi sms:ade dig',
    'Your code is on the way. To log in, enter the code we emailed to':
      'Din kod är på väg. För att logga in, skriv in koden vi mejlade till',
    'Your code is on the way. To log in, enter the code we sent you':
      'Din kod är på väg. För att logga in, knappa in koden vi skickade',
    'Your code is on the way. To log in, enter the code we texted to':
      'Din kod är på väg. För att logga in, ange koden vi sms:ade till',

    // Additional translations
    'An account with the given email already exists.':
      'Det finns redan ett konto med denna e-postadress',
    'Confirm a Code': 'Bekräfta en kod',
    'Confirm Sign In': 'Bekräfta inloggning',
    'Create account': 'Skapa konto',
    'Enter your password': 'Skriv in ditt lösenord',
    'Forgot Password': 'Glömt lösenordet?',
    'Have an account? ': 'Redan registrerad? Kör igång!',
    'Incorrect username or password': 'Fel användarnamn eller lösenord, försök igen',
    'Invalid password format': 'Ogiltigt lösenordsformat, testa något annat',
    'Invalid phone number format': 'Ogiltigt telefonnummer, kolla en extra gång',
    'Lost your code? ': 'Tappat bort koden? Vi fixar en ny',
    'New Password': 'Nytt lösenord',
    'No account? ': 'Inget konto? Fixa ett nu',
    'Password attempts exceeded': 'För många misslyckade försök, ta en paus',
    'Reset password': 'Återställ lösenordet',
    'Sign Out': 'Logga ut',
    'Sign Up': 'Registrera dig',
    'User already exists': 'Användaren finns redan',
    'User does not exist': 'Användaren finns inte',
    'User does not exist.': 'Användaren finns inte',
    'Username cannot be empty': 'Användarnamnet kan inte vara tomt',
    'We Emailed You': 'Vi har skickat e-post till dig',
    'password is required to signIn': 'Lösenord krävs för att logga in',
    'username is required to signIn': 'Användarnamn krävs för att logga in',
    'username is required to signUp': 'Användarnamn krävs för att registrera dig',
    'password is required to signUp': 'Lösenord krävs för att registrera dig',
    'Username should be an email.': 'Ogiltlig E-postadress',
    'Password did not conform with policy: Password not long enough': 'Lösenordet är för kort',
    'Password must be at least 8 characters long': 'Lösenordet måste vara minst 8 tecken',
    'Invalid verification code provided, please try again.':
      'Ogiltig verifieringskod, försök igen',
    'Attempt limit exceeded, please try after some time.':
      'För många misslyckade försök, ta en paus',
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Don't forget this! It should be at the root of your project. */}
      <SafeAreaProvider>
        <AuthContextProvider>
          <LessonContextProvider>
            <ThemeProvider>
              <NavigationContainer>
                <QuizProvider>
                  <AppNavigator />
                </QuizProvider>
              </NavigationContainer>
            </ThemeProvider>
          </LessonContextProvider>
        </AuthContextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
