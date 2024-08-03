import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useProject } from '../context/ProjectContext';
import { useUser } from '../context/UserContext';
import { db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProjectListScreen = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useProject();
  const { user } = useUser();

  useEffect(() => {
    console.log("User:", user);
    console.log("Project ID:", projectId);

    const fetchProjects = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        const projectsRef = collection(db, 'projects');
        const projectsQuery = query(
          projectsRef, 
          where('members', 'array-contains', user.uid)
        );
        const projectsSnapshot = await getDocs(projectsQuery);

        const projectsData = projectsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Projects Data:", projectsData);

        const tasksPromises = projectsData.map(async (project) => {
          const tasksRef = collection(db, 'tasksmanage');
          const tasksQuery = query(
            tasksRef, 
            where('projectId', '==', project.id), 
            where('assignedTo', '==', user.uid)
          );
          const tasksSnapshot = await getDocs(tasksQuery);

          const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          console.log(`Tasks for project ${project.id}:`, tasks);

          return {
            ...project,
            tasks,
          };
        });

        const projectsWithTasks = await Promise.all(tasksPromises);
        setProjects(projectsWithTasks);
      } catch (error) {
        console.error('Error fetching projects and tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, projectId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  if (!projects.length) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No projects available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {projects.map((project) => (
        <View key={project.id} style={styles.projectContainer}>
          <Text style={styles.projectName}>{project.name}</Text>
          {project.tasks.map((task) => (
            <View key={task.id} style={styles.taskContainer}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskDetails}>Due: {task.dueDate.toDate().toLocaleDateString()}</Text>
              <Text style={styles.taskDetails}>Status: {task.status}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00072d',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  noDataText: {
    fontSize: 18,
    color: '#6c757d',
  },
  projectContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  projectName: {
    fontSize: 20,
    color: '#0d6efd',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  taskContainer: {
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    color: '#343a40',
    fontWeight: '500',
  },
  taskDetails: {
    fontSize: 14,
    color: '#495057',
  },
});

export default ProjectListScreen;
