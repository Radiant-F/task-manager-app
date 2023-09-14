import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Counter, Home, SignIn, SignUp, SplashScreen} from '../screens';
import RNBootSplash from 'react-native-bootsplash';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer onReady={() => RNBootSplash.hide({fade: true})}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarColor: 'transparent',
          statusBarTranslucent: true,
        }}
        initialRouteName="Counter">
        <Stack.Screen component={SplashScreen} name="SplashScreen" />
        <Stack.Screen component={SignIn} name="SignIn" />
        <Stack.Screen component={SignUp} name="SignUp" />
        <Stack.Screen component={Home} name="Home" />
        <Stack.Screen component={Counter} name="Counter" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
