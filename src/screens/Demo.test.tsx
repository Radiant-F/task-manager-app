import React, {useState} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Demo() {
  const [openDetail, setOpenDetail] = useState<any | boolean>(null);
  const dummyData = [
    {
      title: 'Tugas Datu',
      desc: 'Deskripsi tugas satu',
      checked: false,
      id: 1,
    },
    {
      title: 'Tugas Dua',
      desc: 'Deskripsi tugas dua',
      checked: true,
      id: 2,
    },
    {
      title: 'Tugas Tiga',
      desc: 'Deskripsi tugas tiga yang sangat panjang sekali.',
      checked: true,
      id: 3,
    },
  ];
  return (
    <FlatList
      data={dummyData}
      renderItem={({item, index: i}) => {
        const onPress = () => {
          LayoutAnimation.easeInEaseOut();
          setOpenDetail(i == openDetail ? null : i);
        };
        const open = openDetail == i;
        return (
          <View style={styles.item}>
            <View style={styles.row}>
              <Text>Header - {i + 1}</Text>
              <Text>{open ? 'close' : 'open'}</Text>
            </View>

            <TouchableOpacity onPress={onPress} activeOpacity={1}>
              {open &&
                [1, 2, 3, 4, 5].map(x => (
                  <Text key={x} style={styles.subItem}>
                    - SOME DATA
                  </Text>
                ))}
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}

function Item({i, active, setActive}: any) {
  const onPress = () => {
    LayoutAnimation.easeInEaseOut();
    setActive(i == active ? null : i);
  };
  const open = active == i;
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={1}>
      <View style={styles.row}>
        <Text>Header - {i + 1}</Text>
        <Text>{open ? 'close' : 'open'}</Text>
      </View>
      {open &&
        [1, 2, 3, 4, 5].map(x => (
          <Text key={x} style={styles.subItem}>
            - SOME DATA
          </Text>
        ))}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 50,
    paddingTop: 5,
  },
  item: {
    width: '100%',
    borderWidth: 1,
    paddingHorizontal: 20,
    overflow: 'hidden',
    paddingVertical: 10,
    marginBottom: 5,
  },
  subItem: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
