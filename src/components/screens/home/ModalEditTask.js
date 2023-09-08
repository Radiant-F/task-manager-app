import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  TouchableOpacity,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Gap from '../Gap';
import {HelveticaNeueMedium} from '../..';

export default function ModalEditTask({
  visible,
  onRequestClose,
  onChangeTitle,
  valueTitle,
  onChangeDesc,
  valueDesc,
  onPressSubmit,
  loading,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}>
      <View style={styles.modalContainer}>
        <Pressable style={styles.modalBackdrop} onPress={onRequestClose} />
        <View style={styles.viewModalContainer}>
          <View style={styles.viewModalHeader}>
            <Icon name={'notebook-edit-outline'} color={'white'} size={23} />
            <Text style={styles.textDefault}>Edit Tugas</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Icon name={'close-circle-outline'} color={'white'} size={23} />
            </TouchableOpacity>
          </View>
          <View style={styles.viewModalInput}>
            {/* input task title */}
            <Text style={styles.textInputTitle}>Judul</Text>
            <View style={styles.viewInput}>
              <Icon name={'notebook-outline'} color={'black'} size={23} />
              <TextInput
                placeholder="Judul tugas..."
                style={{flex: 1, fontFamily: HelveticaNeueMedium}}
                onChangeText={onChangeTitle}
                value={valueTitle}
              />
            </View>

            <Gap height={15} />

            {/* input task desc */}
            <Text style={styles.textInputTitle}>Deskripsi</Text>
            <View style={styles.viewInput}>
              <Icon name={'text-box-outline'} color={'black'} size={23} />
              <TextInput
                placeholder="Deskripsi tugas.."
                style={{flex: 1, fontFamily: HelveticaNeueMedium}}
                onChangeText={onChangeDesc}
                value={valueDesc}
              />
            </View>

            <Gap height={30} />

            {/* button submit */}
            <TouchableNativeFeedback useForeground onPress={onPressSubmit}>
              <View style={styles.btnSubmitAdd}>
                {loading ? (
                  <ActivityIndicator color={'white'} />
                ) : (
                  <Text style={styles.textBtnTitle}>Ubah</Text>
                )}
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textBtnTitle: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: HelveticaNeueMedium,
    fontSize: 15,
  },
  textDefault: {
    color: 'white',
    fontFamily: HelveticaNeueMedium,
  },
  btnSubmitAdd: {
    height: 45,
    width: 130,
    backgroundColor: '#00677E',
    overflow: 'hidden',
    // paddingHorizontal: 50,
    alignSelf: 'center',
    borderRadius: 45 / 2,
    elevation: 3,
    justifyContent: 'center',
  },
  viewModalInput: {
    padding: 30,
    paddingTop: 0,
  },
  textInputTitle: {
    color: 'white',
    fontFamily: HelveticaNeueMedium,
    marginBottom: 5,
  },
  viewInput: {
    backgroundColor: 'white',
    height: 50,
    flexDirection: 'row',
    borderRadius: 50 / 2,
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 5,
  },
  viewModalHeader: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  viewModalContainer: {
    backgroundColor: '#164877',
    width: '85%',
    alignSelf: 'center',
    maxWidth: 480,
    borderRadius: 20,
    elevation: 5,
  },
  modalBackdrop: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.4,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
