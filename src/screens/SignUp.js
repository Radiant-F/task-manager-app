import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Background, Gap} from '../components';
import CheckBox from '@react-native-community/checkbox';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import {setToken, SetUsername} from '../redux/slice/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {SetLoading, SetFormData} from '../redux/slice/signUpSlice';

export default function SignUp({navigation}) {
  const dispatch = useDispatch();
  const {loading, form_data} = useSelector(state => state.sign_up);

  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const [rememberUser, setRememberUser] = useState(false);

  function setForm(formName, value) {
    return dispatch(SetFormData({formName, value}));
  }

  const instance = token =>
    axios.create({
      baseURL: 'https://todoapi-production-61ef.up.railway.app/api/v1',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

  async function submitSignUp() {
    dispatch(SetLoading());
    try {
      const resSignUp = await instance().post('/auth/register', form_data);
      dispatch(setToken(resSignUp.data.user.token));
      const resUserData = await instance(resSignUp.data.user.token).get(
        '/profile',
      );
      dispatch(SetUsername(resUserData.data.user.username));
      dispatch(SetLoading());
      rememberUser &&
        EncryptedStorage.setItem(
          'user_credential',
          JSON.stringify({email, password}),
        );
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    } catch (error) {
      dispatch(SetLoading());
      if (error.response) {
        console.log(error.response.data);
        ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
      } else console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Background />

      <View>
        <ScrollView>
          <View style={styles.viewContainer}>
            <Text style={styles.textTitle}>Sign Up</Text>
            <Gap height={15} />

            <View style={styles.viewSignIn}>
              {/* Input name */}
              <Text style={styles.textInputTitle}>Nama</Text>
              <View style={styles.viewInput}>
                <Icon name={'account'} color={'black'} size={23} />
                <TextInput
                  placeholder="Masukan Nama..."
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onChangeText={value => setForm('username', value)}
                />
              </View>

              <Gap height={20} />

              {/* Input email */}
              <Text style={styles.textInputTitle}>Email</Text>
              <View style={styles.viewInput}>
                <Icon name={'gmail'} color={'black'} size={23} />
                <TextInput
                  placeholder="contoh@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  onChangeText={value => setForm('email', value)}
                />
              </View>

              <Gap height={20} />

              {/* input password */}
              <Text style={styles.textInputTitle}>Password</Text>
              <View style={styles.viewInput}>
                <Icon name={'lock'} color={'black'} size={23} />
                <TextInput
                  placeholder="Kata sandi.."
                  style={styles.input}
                  secureTextEntry={securePassword}
                  autoCapitalize="none"
                  onChangeText={value => setForm('password', value)}
                />
                <TouchableOpacity
                  onPress={() => setSecurePassword(!securePassword)}>
                  <Icon
                    name={securePassword ? 'eye-off' : 'eye'}
                    color={'black'}
                    size={23}
                  />
                </TouchableOpacity>
              </View>

              <Gap height={20} />

              {/* input password */}
              <Text style={styles.textInputTitle}>Confirm Password</Text>
              <View style={styles.viewInput}>
                <Icon name={'lock'} color={'black'} size={23} />
                <TextInput
                  placeholder="Konfirmasi sandi.."
                  style={styles.input}
                  secureTextEntry={secureConfirmPassword}
                  autoCapitalize="none"
                  onChangeText={value => setForm('confirmPassword', value)}
                />
                <TouchableOpacity
                  onPress={() =>
                    setSecureConfirmPassword(!secureConfirmPassword)
                  }>
                  <Icon
                    name={secureConfirmPassword ? 'eye-off' : 'eye'}
                    color={'black'}
                    size={23}
                  />
                </TouchableOpacity>
              </View>

              {/* checkbox remember me */}
              <View style={styles.viewRememberMe}>
                <CheckBox
                  tintColors={{false: 'white', true: 'white'}}
                  value={rememberUser}
                  onValueChange={() => setRememberUser(!rememberUser)}
                />
                <Text
                  style={styles.plainText}
                  onPress={() => setRememberUser(!rememberUser)}>
                  Ingat Saya
                </Text>
              </View>

              <Gap height={20} />

              {/* submit & register button */}
              <TouchableNativeFeedback useForeground onPress={submitSignUp}>
                <View style={styles.btnSubmit}>
                  {loading ? (
                    <ActivityIndicator color={'white'} />
                  ) : (
                    <Text style={styles.textBtnTitle}>Daftar</Text>
                  )}
                </View>
              </TouchableNativeFeedback>
              <Gap height={10} />
              <TouchableNativeFeedback
                useForeground
                onPress={() => navigation.goBack()}>
                <View
                  style={{
                    ...styles.btnSubmit,
                    backgroundColor: '#9A4242',
                    width: 150,
                  }}>
                  <Text style={styles.textBtnTitle}>Kembali</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textBtnTitle: {
    color: 'white',
    position: 'absolute',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,
  },
  btnSubmit: {
    height: 45,
    width: 230,
    backgroundColor: '#00677E',
    borderRadius: 45 / 2,
    elevation: 3,
    overflow: 'hidden',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  plainText: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  viewRememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
    fontFamily: 'HelveticaNeue-Medium',
    color: 'black',
  },
  textInputTitle: {
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
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
  viewSignIn: {
    backgroundColor: '#ffffff4d',
    width: '95%',
    borderRadius: 20,
    padding: 30,
  },
  textTitle: {
    color: 'white',
    fontSize: 27,
    fontFamily: 'HelveticaNeue-Heavy',
  },
  viewContainer: {
    alignSelf: 'center',
    maxWidth: 480,
    width: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
  },
});
