import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import moment from 'moment';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

const TodoListScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(moment().format('DD MMM'));

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const userId = auth.currentUser.uid;
        const q = query(collection(db, 'tasks'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const fetchedTasks = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('Task data:', data); // Log the task data

          // Handle different formats of dueDate
          let dueDate;
          if (data.dueDate instanceof Date) {
            dueDate = data.dueDate;
          } else if (data.dueDate.seconds && data.dueDate.nanoseconds) {
            dueDate = new Date(data.dueDate.seconds * 1000 + data.dueDate.nanoseconds / 1000000);
          } else {
            dueDate = new Date(data.dueDate);
          }

          return {
            id: doc.id,
            ...data,
            dueDate: dueDate,
          };
        });
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddNewTask = () => {
    navigation.navigate('AddNewTask');
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="chevron-back" size={24} color="white" onPress={goBack} style={styles.icon} />
        <Text style={styles.headerTitle}>{currentDate}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNewTask}>
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
        {tasks.length === 0 ? (
          <Text style={styles.noTasksText}>No tasks available</Text>
        ) : (
          tasks.map((task, index) => (
            <View key={index} style={styles.taskContainer}>
              <View style={styles.taskContent}>
                <View>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskTime}>{task.time}</Text>
                  <Text style={styles.taskDate}>Due: {task.dueDate ? moment(task.dueDate).format('DD MMM YYYY') : 'N/A'}</Text>
                </View>
                <Pressable onPress={() => handleDeleteTask(task.id)}>
                  <FontAwesome name="trash" size={24} color="red" />
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101223',
  },
  header: {
    backgroundColor: '#3D5AFE',
    paddingHorizontal: 45,
    paddingVertical: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  icon: {
    position: 'absolute',
    left: 20,
    top: 45,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#3D5AFE',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    marginTop: 20,
  },
  taskContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskTime: {
    fontSize: 14,
    color: '#7E7E7E',
    marginTop: 5,
  },
  taskDate: {
    fontSize: 14,
    color: '#7E7E7E',
    marginTop: 5,
  },
  noTasksText: {
    fontSize: 18,
    color: '#7E7E7E',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TodoListScreen;
