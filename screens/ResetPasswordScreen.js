import React, { useState } from 'react';
import { Text, View, StyleSheet, SafeAreaView, Alert } from 'react-native';
import Button from '../components/Button';
import { auth } from '../utils/firebase';
import { Input } from 'react-native-elements';

function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  
  /**
 * Will trigger firebase to send reset email link to 
 * the user's registered email 
 */
  const resetPassword = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        navigation.navigate('Login');
        Alert.alert(
          'Reset password',
          'If an account is associated with that email, a reset password link will be sent to it.'
        );
      })
      .catch((e) => {
        navigation.navigate('Login');
        Alert.alert(
          'Reset password',
          'If an account is associated with that email, a reset password link will be sent to it.'
        );
      });
    // we don't want to tell potential attackers that they entered
    // a valid account's email address so even if it's not a real
    // account we don't tell them that and give them more info
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEE' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Reset password</Text>
        <Text style={styles.description}>
          Enter your email below to reset your password.
        </Text>
        <Input
          placeholder='johnsmith@domain.com'
          label='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          containerStyle={styles.input}
          autoCapitalize='none'
          autoCompleteType='email'
          autoCorrect={false}
          importantForAutofill='auto'
          keyboardType='email-address'
          maxLength={50}
          returnKeyType='next'
          textContentType='emailAddress'
        />
        <Button label='Reset password' onPress={resetPassword} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 35,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  input: {
    marginVertical: 20,
  },
  description: {
    marginVertical: 30,
    fontSize: 18,
  },
});

export default ResetPasswordScreen;
