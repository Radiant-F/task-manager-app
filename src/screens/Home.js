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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Background,
  Gap,
  UserProfile,
  RenderTask,
  ModalAddTask,
  ModalEditTask,
} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function Home({route}) {
  const token = route.params.token;
  const [openDetail, setOpenDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const [tasks, setTasks] = useState([]);

  function getTasks() {
    fetch('https://todoapi-production-61ef.up.railway.app/api/v1/todos', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status == 'success') {
          setTasks(json.data.todos);
        }
      })
      .catch(error => {
        console.log(error);
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
    fetch('https://todoapi-production-61ef.up.railway.app/api/v1/todos', {
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
        } else console.log(json);
      })
      .catch(error => {
        setLoadingAdd(false);
        console.log(error);
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
    fetch(
      `https://todoapi-production-61ef.up.railway.app/api/v1/todos/${editedTask._id}`,
      {
        method: 'PUT',
        body: JSON.stringify(editedTask),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(response => response.json())
      .then(json => {
        setLoadingEdit(false);
        if (json.status == 'success') {
          getTasks();
          setModalEditVisible(false);
        } else console.log(json);
      })
      .catch(error => {
        setLoadingEdit(false);
        console.log(error);
      });
  }

  function deleteTask(id) {
    setLoading(true);
    fetch(`https://todoapi-production-61ef.up.railway.app/api/v1/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        if (json.status == 'success') {
          getTasks();
        } else console.log(json);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }

  function confirmDelete(id) {
    Alert.alert(
      'Hapus Tugas',
      'Hapus tugas? tindakan ini tidak dapat diulangi',
      [
        {
          text: 'Hapus',
          onPress: () => deleteTask(id),
        },
        {
          text: 'Batal',
        },
      ],
    );
  }

  function checklistTask(task) {
    setLoading(true);
    fetch(
      `https://todoapi-production-61ef.up.railway.app/api/v1/todos/${task._id}`,
      {
        method: 'PUT',
        body: JSON.stringify({checked: !task.checked}),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then(response => response.json())
      .then(json => {
        setLoading(false);
        if (json.status == 'success') {
          getTasks();
        } else console.log(json);
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  }

  return (
    <View style={styles.container}>
      <Background />

      {/* user profile */}
      <UserProfile token={token} />

      <View style={styles.viewLine} />

      {/* view data */}
      <FlatList
        data={tasks}
        ListEmptyComponent={
          <Text style={styles.textEmpty}>Tidak ada tugas</Text>
        }
        keyExtractor={(item, index) => index}
        refreshing={loading}
        onRefresh={() => getTasks()}
        ListFooterComponent={<Gap height={20} />}
        renderItem={({item, index}) => {
          const handleOpenDetail = () => {
            LayoutAnimation.easeInEaseOut();
            setOpenDetail(index == openDetail ? null : index);
          };
          const open = openDetail == index;
          return (
            <RenderTask
              item={item}
              onCheck={() => checklistTask(item)}
              openDetail={handleOpenDetail}
              open={open}
              onPressDelete={() => confirmDelete(item._id)}
              onPressEdit={() => {
                setModalEditVisible(true);
                setEditedTask(item);
              }}
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
        visible={modalAddVisible}
        onClose={closeModal}
        onChangeTitle={title => setTitle(title)}
        onChangeDesc={desc => setDesc(desc)}
        loading={loadingAdd}
        onSubmit={addTask}
      />

      {/* modal edit */}
      <ModalEditTask
        visible={modalEditVisible}
        onClose={closeModalEdit}
        onChangeTitle={title => setEditedTask({...editedTask, title})}
        valueTitle={editedTask.title}
        onChangeDesc={desc => setEditedTask({...editedTask, desc})}
        valueDesc={editedTask.desc}
        onSubmit={editTask}
        loading={loadingEdit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textEmpty: {
    textAlign: 'center',
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  textBtnTitle: {
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'HelveticaNeue-Medium',
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
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
