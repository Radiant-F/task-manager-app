import {StyleSheet, Text, View, Button} from 'react-native';
import React, {useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  incrementCount,
  decrementCount,
  addCountBy,
  minusCountBy,
} from '../redux/slice/counterSlice';

export default function Counter() {
  const dispatch = useDispatch();
  const {age, count} = useSelector(state => state.counter);

  return (
    <View>
      <Text style={{fontSize: 50}}>{count}</Text>
      <Button title="increment" onPress={() => dispatch(incrementCount())} />
      <Button title="decrement" onPress={() => dispatch(decrementCount())} />
      <Button
        title="tambah dengan jumlah..."
        onPress={() => dispatch(addCountBy(15))}
      />
      <Button
        title="kurangi dengan jumlah..."
        onPress={() => dispatch(minusCountBy(35))}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
