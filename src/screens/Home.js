import {
  FlatList,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Platform,
  UIManager,
  LayoutAnimation,
  Alert,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Background,
  Gap,
  UserProfile,
  RenderItem,
  ModalAddTask,
  ModalEditTask,
  HelveticaNeueMedium,
} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useSelector} from 'react-redux';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home({navigation}) {
  const {token} = useSelector(state => state.user);
  const [openDetail, setOpenDetail] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const instance = axios.create({
    baseURL: 'https://todoapi-production-61ef.up.railway.app/api/v1',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  instance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 500 &&
        error.response.data.message === 'jwt expired'
      ) {
        try {
          const value = await EncryptedStorage.getItem('user_credential');
          const {data} = await instance.post('/auth/login', JSON.parse(value));
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${data.user.token}`;
          return instance(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );

  async function getTasks() {
    setLoading(true);
    try {
      const {data} = await instance.get('/todos');
      setTasks(data.data.todos);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error.response.data);
      setLoading(false);
    }
  }
  useEffect(() => {
    getTasks();
  }, []);

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const closeModal = () => setModalAddVisible(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  async function addTask() {
    setLoadingAdd(true);
    try {
      const {data} = await instance.post('/todos', {title, desc});
      console.log(data);
      setLoadingAdd(false);
      getTasks();
      setModalAddVisible(false);
    } catch (error) {
      console.log(error.response.data);
      ToastAndroid.show(error.response.data.message, ToastAndroid.LONG);
      setLoadingAdd(false);
    }
  }

  const [modalEditVisible, setModalEditVisible] = useState(false);
  const closeModalEdit = () => setModalEditVisible(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: '',
    desc: '',
    checked: null,
    _id: null,
  });

  async function editTask() {
    setLoadingEdit(true);
    try {
      await instance.put(`/todos/${editedTask._id}`, editedTask);
      getTasks();
      setModalEditVisible(false);
      setLoadingEdit(false);
    } catch (error) {
      console.log(error);
      setLoadingEdit(false);
    }
  }

  async function deleteTask(id) {
    setLoading(true);
    try {
      await instance.delete(`/todos/${id}`);
      setLoading(false);
      getTasks();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }
  function confirmDelete(id) {
    Alert.alert(
      'Hapus Tugas',
      'Hapus aktivitas?',
      [
        {
          text: 'Batal',
        },
        {
          text: 'Hapus',
          onPress: () => deleteTask(id),
        },
      ],
      {cancelable: true},
    );
  }

  async function checklistTask(task) {
    setLoading(true);
    try {
      await instance.put(`/todos/${task._id}`, {
        checked: !task.checked,
      });
      getTasks();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.viewContainer}>
        {/* user profile */}
        <UserProfile token={token} navigation={navigation} />

        <View style={styles.viewLine} />

        {/* view data */}
        <FlatList
          data={tasks}
          keyExtractor={(item, index) => index}
          refreshing={loading}
          onRefresh={getTasks}
          ListFooterComponent={<Gap height={20} />}
          ListEmptyComponent={
            <Text style={styles.textEmpty}>Tidak ada tugas</Text>
          }
          renderItem={({item, index}) => {
            const handleOpenDetail = () => {
              LayoutAnimation.easeInEaseOut();
              setOpenDetail(index == openDetail ? null : index);
            };
            const open = openDetail == index;
            return (
              <RenderItem
                item={item}
                onCheckBox={() => checklistTask(item)}
                onPressDelete={() => confirmDelete(item._id)}
                onPressDetail={handleOpenDetail}
                onPressEdit={() => {
                  setModalEditVisible(true);
                  setEditedTask(item);
                }}
                open={open}
              />
            );
          }}
        />

        {/* button add */}
        <View style={styles.viewLine} />
        <TouchableNativeFeedback
          useForeground
          onPress={() => setModalAddVisible(true)}>
          <View style={styles.btnAdd}>
            <Icon name="plus-circle-outline" color={'white'} size={20} />
            <Gap width={5} />
            <Text style={styles.textBtnTitle}>Tambah</Text>
          </View>
        </TouchableNativeFeedback>
        <Gap height={30} />

        {/* modal add */}
        <ModalAddTask
          loading={loadingAdd}
          onChangeDesc={setDesc}
          onChangeTitle={setTitle}
          onPressSubmit={addTask}
          onRequestClose={closeModal}
          visible={modalAddVisible}
        />

        {/* modal edit */}
        <ModalEditTask
          loading={loadingEdit}
          onChangeDesc={desc => setEditedTask({...editedTask, desc})}
          onChangeTitle={title => setEditedTask({...editedTask, title})}
          onPressSubmit={editTask}
          onRequestClose={closeModalEdit}
          valueDesc={editedTask.desc}
          valueTitle={editedTask.title}
          visible={modalEditVisible}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 630,
    alignSelf: 'center',
  },
  textEmpty: {
    color: 'white',
    textAlign: 'center',
  },
  textBtnTitle: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: HelveticaNeueMedium,
    fontSize: 15,
  },
  btnAdd: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#164877',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
    marginTop: -50,
    borderRadius: 50 / 2,
    elevation: 3,
    overflow: 'hidden',
  },
  viewLine: {
    width: '85%',
    height: 2,
    backgroundColor: 'white',
    alignSelf: 'center',
    transform: [{rotate: '-2deg'}],
    marginVertical: 30,
    marginBottom: 25,
  },
  textDefault: {
    color: 'white',
    fontFamily: HelveticaNeueMedium,
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
