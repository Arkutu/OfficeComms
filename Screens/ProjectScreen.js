import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../firebaseConfig';
import { OrganizationContext } from '../context/OrganizationContext';
import { collection, doc, getDoc, addDoc, serverTimestamp, Timestamp, writeBatch } from 'firebase/firestore';

const ProjectScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { selectedOrganizationId } = useContext(OrganizationContext);
  const userId = auth.currentUser.uid;

  useEffect(() => {
    const fetchMembers = async () => {
      if (selectedOrganizationId) {
        try {
          const orgDoc = await getDoc(doc(db, 'organizations', selectedOrganizationId));

          if (orgDoc.exists()) {
            const membersData = orgDoc.data().members || [];

            if (membersData.length > 0) {
              const userPromises = membersData.map(memberId =>
                getDoc(doc(db, 'users', memberId))
              );
              const users = await Promise.all(userPromises);
              const members = users.map(user => ({
                uid: user.id,
                displayName: user.data().displayName,
              }));
              setOrganizationMembers(members);
            } else {
              setOrganizationMembers([]);
            }
          } else {
            setOrganizationMembers([]);
          }
        } catch (error) {
          console.error('Error fetching members:', error);
          setOrganizationMembers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setOrganizationMembers([]);
      }
    };

    fetchMembers();
  }, [selectedOrganizationId]);

  const addTask = () => {
    if (!taskTitle || !assignedTo || !dueDate) {
      Alert.alert('Please fill out all task fields');
      return;
    }
    setTasks([...tasks, { title: taskTitle, assignedTo, dueDate }]);
    setTaskTitle('');
    setAssignedTo('');
    setDueDate('');
  };

  const saveProject = async () => {
    if (!projectName || !projectDescription || tasks.length === 0) {
      Alert.alert('Please fill out all project fields and add at least one task');
      return;
    }

    const newProject = {
      name: projectName,
      description: projectDescription,
      organizationId: selectedOrganizationId,
      ownerId: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const projectRef = await addDoc(collection(db, 'projects'), newProject);
      const projectId = projectRef.id;

      const batch = writeBatch(db);

      tasks.forEach((task) => {
        const taskRef = doc(collection(db, 'tasksmanage'));
        batch.set(taskRef, {
          projectId,
          title: task.title,
          description: 'Task Description',
          assignedTo: task.assignedTo,
          dueDate: Timestamp.fromDate(new Date(task.dueDate)),
          status: 'Pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      navigation.navigate('ProjectListScreen', { projectId });
    } catch (error) {
      console.error('Error adding project and tasks: ', error);
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.container}>
        <View style={{ marginBottom: 5 }} />    
        <Text style={styles.title}>Create Project</Text>
        <TextInput
          style={styles.input}
          value={projectName}
          onChangeText={setProjectName}
          placeholder="Enter project name"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={projectDescription}
          onChangeText={setProjectDescription}
          placeholder="Enter project description"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          value={taskTitle}
          onChangeText={setTaskTitle}
          placeholder="Enter task title"
          placeholderTextColor="#888"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={assignedTo}
            onValueChange={(itemValue) => setAssignedTo(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a member" value="" />
            {organizationMembers.map((member) => (
              <Picker.Item key={member.uid} label={member.displayName} value={member.uid} />
            ))}
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          value={dueDate}
          onChangeText={setDueDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Add Task</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={saveProject}>
          <Text style={styles.buttonText}>Save Project</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#0d6efd',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    color: '#000',
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 25,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#000',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
});

export default ProjectScreen;
