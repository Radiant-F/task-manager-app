import {StyleSheet, Text, View, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

export default function UserProfile({token}) {
  const [username, setUsername] = useState('Pengguna');

  async function getUserData() {
    try {
      const response = await axios.get(
        'https://todoapi-production-61ef.up.railway.app/api/v1/profile',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setUsername(response.data.user.username);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.viewProfile}>
      <View>
        <Text style={styles.textDefault}>Hi,</Text>
        <Text style={styles.textUserName}>{username}</Text>
      </View>
      <Icon name="account-circle" color="white" size={50} />
    </View>
  );
}

const styles = StyleSheet.create({
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
