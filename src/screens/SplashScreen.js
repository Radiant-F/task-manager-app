import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {Background} from '../components';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {setToken, SetUsername} from '../redux/slice/userSlice';

export default function SplashScreen({navigation}) {
  const dispatch = useDispatch();
  const instance = token =>
    axios.create({
      baseURL: 'https://todoapi-production-61ef.up.railway.app/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  async function refreshToken() {
    try {
      const value = await EncryptedStorage.getItem('user_credential');
      const resSignIn = await instance().post('/auth/login', JSON.parse(value));
      dispatch(setToken(resSignIn.data.user.token));
      const resUserData = await instance(resSignIn.data.user.token).get(
        '/profile',
      );
      dispatch(SetUsername(resUserData.data.user.username));
      navigation.replace('Home');
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        navigation.replace('SignIn');
      }, 3000);
    }
  }

  useEffect(() => {
    refreshToken();
  }, []);

  return (
    <View style={styles.container}>
      <Background />
      <Image
        source={require('../assets/images/app_logo.png')}
        style={{width: 150, height: 150}}
      />
      <Text style={styles.textVersion}>v0.0.1-alpha-rc</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textVersion: {
    color: 'white',
    fontFamily: 'HelveticaNeue-MediumExt',
    position: 'absolute',
    bottom: 5,
    fontSize: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
