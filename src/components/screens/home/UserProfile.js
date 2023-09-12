import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import EncryptedStorage from 'react-native-encrypted-storage';

export default function UserProfile({token, navigation}) {
  const [userData, setUserData] = useState({
    username: '',
    avatar: {
      url: '',
    },
  });

  function getUser() {
    fetch('https://todoapi-production-61ef.up.railway.app/api/v1/profile', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          setUserData({...userData, ...json.user});
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  useEffect(() => {
    getUser();
  }, []);

  async function signOut() {
    try {
      await EncryptedStorage.removeItem('user_credential');
      navigation.replace('SignIn');
    } catch (error) {
      console.log(error);
    }
  }
  function confirmSignOut() {
    Alert.alert('Keluar?', 'Sesi Anda akan berakhir.', [
      {text: 'Batal'},
      {text: 'Keluar', onPress: () => signOut()},
    ]);
  }

  return (
    <TouchableNativeFeedback onPress={confirmSignOut}>
      <View style={styles.viewProfile}>
        <View>
          <Text style={styles.textDefault}>Hi,</Text>
          <Text style={styles.textUserName}>
            {userData.username == '' ? 'User Name' : userData.username}
          </Text>
        </View>
        {userData.avatar.url == '' ? (
          <Icon name="account-circle" color="white" size={50} />
        ) : (
          <Image
            source={{uri: userData.avatar.url}}
            style={styles.imgProfile}
          />
        )}
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  imgProfile: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  textUserName: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Heavy',
    fontSize: 20,
  },
  textDefault: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  viewProfile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20 + StatusBar.currentHeight,
    marginHorizontal: 30,
    alignItems: 'center',
  },
});
