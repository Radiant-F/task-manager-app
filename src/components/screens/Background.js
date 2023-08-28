import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function Background() {
  return (
    <Image
      source={require('../images/app-background.jpg')}
      style={styles.image}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
