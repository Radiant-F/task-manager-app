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

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home({route}) {
  const token = route.params.data.user.token;
  const host = 'https://todoapi-production-61ef.up.railway.app/api/v1';
  const [openDetail, setOpenDetail] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  function getTasks() {
    setLoading(true);
    fetch(`${host}/todos`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        if (json.status == 'success') {
          setTasks(json.data.todos);
        } else console.log(json);
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }
  useEffect(() => {
    getTasks();
  }, []);

  const [modalAddVisible, setModalAddVisible] = useState(false);
  const closeModal = () => setModalAddVisible(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  function addTask() {
    setLoadingAdd(true);
    fetch(`${host}/todos`, {
      method: 'POST',
      body: JSON.stringify({title, desc}),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoadingAdd(false);
        if (json.status == 'success') {
          getTasks();
          setModalAddVisible(false);
        } else ToastAndroid.show(json.message, ToastAndroid.SHORT);
      })
      .catch(err => {
        setLoadingAdd(false);
        console.log(err);
      });
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

  function editTask() {
    setLoadingEdit(true);
    fetch(`${host}/todos/${editedTask._id}`, {
      method: 'PUT',
      body: JSON.stringify(editedTask),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoadingEdit(false);
        if (json.status == 'success') {
          getTasks();
          setModalEditVisible(false);
        } else console.log(json);
      })
      .catch(err => {
        setLoadingEdit(false);
        console.log(err);
      });
  }

  function deleteTask(id) {
    setLoading(true);
    fetch(`${host}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          getTasks();
        } else {
          setLoading(false);
          console.log(json);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
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

  function checklistTask(task) {
    setLoading(true);
    fetch(`${host}/todos/${task._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        checked: !task.checked,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          getTasks();
        } else {
          setLoading(false);
          console.log(json);
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  }

  return (
    <View style={styles.container}>
      <Background />

      <View style={styles.viewContainer}>
        {/* user profile */}
        <UserProfile token={token} />

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
