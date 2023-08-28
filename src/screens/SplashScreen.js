import {StyleSheet, Text, View, Button, Image} from 'react-native';
import React, {useEffect} from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Background} from '../components';
import {ImgAppLogo} from '../components';

export default function SplashScreen({navigation}) {
  //   useEffect(() => {
  //     EncryptedStorage.getItem('user_credential')
  //       .then(credential => {
  //         const parsedCredential = JSON.parse(credential);
  //         if (parsedCredential) {
  //           setTimeout(() => {
  //             navigation.replace('Home');
  //           }, 2000);
  //         } else {
  //           navigation.navigate('SignIn');
  //         }
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //   }, []);

  return (
    <View style={styles.container}>
      <Background />
      <Image source={ImgAppLogo} style={{width: 120, height: 120}} />
      <Text style={styles.textVersion}>v0.0.1-alpha-rc</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textVersion: {
    position: 'absolute',
    bottom: 5,
    fontFamily: 'HelveticaNeue-Extended',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
