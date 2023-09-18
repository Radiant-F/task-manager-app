import {View, Text, Button} from 'react-native';
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  decrement,
  decrementBy,
  increment,
  incrementBy,
} from '../redux/slice/counterSlice';

export default function Counter() {
  const dispatch = useDispatch();
  const {count} = useSelector(state => state.counter);
  return (
    <View>
      <Text style={{fontSize: 50, textAlign: 'center'}}>{count}</Text>
      <Button title="tambah" onPress={() => dispatch(increment())} />
      <Button title="kurang" onPress={() => dispatch(decrement())} />
      <Button
        title="tambah dengan..."
        onPress={() => dispatch(incrementBy(30))}
      />
      <Button
        title="kurangi dengan..."
        onPress={() => dispatch(decrementBy(50))}
      />
    </View>
  );
}
