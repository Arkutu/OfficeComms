import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
} from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ToDoScreen = ({ navigation }) => {
  const [searchTodos, setSearchTodos] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [showFooter, setShowFooter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    return null;
  }

  const userId = currentUser.uid;

  const toggleFooter = () => {
    setShowFooter(!showFooter);
  };

  const deleteTask = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    setModalVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#ccc",
      },
      headerTitleStyle: { color: "#ccc" },
      headerTintColor: "black",
      headerLeft: () => (
        <View style={{ marginLeft: 13 }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.leftIconContainer}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-sharp" size={28} color="#333" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View>
          <Text style={styles.textTop}>To-dos</Text>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched tasks:", taskList); // Log fetched tasks
      setTasks(taskList);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const addTask = async () => {
    if (newTask.trim() !== "") {
      await addDoc(collection(db, "tasks"), {
        task: newTask,
        description: newTaskDesc,
        userId: userId,
      });
      setNewTask("");
      setNewTaskDesc("");
      toggleFooter();
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.task ? task.task.toLowerCase().includes(searchTodos.toLowerCase()) : false
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {showFooter && (
        <View style={styles.footerContainer}>
          <View style={styles.todoTastContainer}>
            <TouchableOpacity onPress={toggleFooter} activeOpacity={0.5}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.todoText}>Create new to-do</Text>
            <TouchableOpacity
              onPress={addTask}
              activeOpacity={0.5}
              style={styles.confBtnContainer}
            >
              <Text style={styles.confBtn}>Save</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <View
              style={[
                styles.inputContainer,
                isFocused || inputValue ? styles.inputContainerFocused : null,
              ]}
            >
              <TextInput
                style={styles.textInput}
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={setNewTask}
                value={newTask}
                placeholder="Write down your to-do list here..."
                placeholderTextColor="#888"
              />
            </View>
          </View>
        </View>
      )}

      <View style={styles.innerContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.icon}>
            <AntDesign name="search1" size={24} color="gray" />
          </View>
          <TextInput
            placeholder="Search to-dos"
            placeholderTextColor={"gray"}
            value={searchTodos}
            onChangeText={(text) => setSearchTodos(text)}
            style={styles.search}
          />
        </View>

        <ScrollView>
          {filteredTasks.map((task) => (
            <View style={styles.taskOuterContainer} key={task.id}>
              <View style={styles.taskContainer}>
                <View style={styles.taskMainContainer}>
                  <TouchableOpacity
                    style={styles.circleIcon}
                    onPress={() => handleTaskPress(task)}
                  >
                    <FontAwesome name="circle-thin" size={24} color="gray" />
                  </TouchableOpacity>
                  <Text style={styles.taskTextMain}>{task.task}</Text>
                </View>
                <View style={styles.taskTextDescContainer}>
                  {task.description ? (
                    <Text style={styles.taskTextDesc}>
                      Description: {task.description}
                    </Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.floatingButton}
        onPress={toggleFooter}
      >
        <Entypo name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to complete this task?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={() => deleteTask(selectedTask.id)}
              >
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ToDoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ccc",
  },
  textTop: {
    fontSize: 24,
    fontWeight: "600",
    color: "#555",
    marginRight: 10,
  },
  innerContainer: {
    padding: 10,
  },
  searchContainer: {
    width: "100%",
    borderColor: "#ddd",
    marginBottom: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  search: {
    position: "absolute",
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#eee",
    backgroundColor: "#eee",
    padding: 8,
    fontSize: 16,
    paddingHorizontal: 40,
    color: "#333",
    marginLeft: 10,
    zIndex: 0,
  },
  icon: {
    marginLeft: 10,
    zIndex: 1,
  },
  floatingButton: {
    position: "absolute",
    top: 630,
    right: 20,
    backgroundColor: "#555",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  footerContainer: {
    marginTop: 280,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 10,
  },
  todoTastContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  todoText: {
    fontSize: 16,
    fontWeight: "500",
    
  },
  confBtnContainer: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#2b68e6",
    backgroundColor: "#2b68e6",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  confBtn: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    marginRight: 2,
  },
  inputContainer: {
    position: "relative",
    
  },
  inputContainerFocused: {
    // borderColor: "blue",
    // borderWidth: 1,
  },
  textInput: {
    fontSize: 16,
    padding: 10,
    borderRadius: 5,
    color:'#000',
  },
  taskOuterContainer: {
    zIndex: 1,
  },
  taskContainer: {
    marginVertical: 6,
    backgroundColor: '#333',
    borderWidth: 1,
    padding: 14,
    borderColor: "#ddd",
    borderRadius: 5,
    
  },
  taskMainContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    
  },
  taskTextDescContainer: {
    marginLeft: 30,
    
  },
  circleIcon: {
    marginRight: 10,
  },
  taskTextMain: {
    fontSize: 18,
  },
  taskTextDesc: {
    fontSize: 15,
    color: "#555",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color:'#000',
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    marginHorizontal: 10,
  },
  buttonConfirm: {
    backgroundColor: "#2196F3",
  },
  buttonCancel: {
    backgroundColor: "#f44336",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
