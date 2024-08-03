import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

// Fetch users belonging to an organization
export const fetchOrganizationUsers = async (organizationId) => {
  const usersQuery = query(collection(db, 'users'), where('organizations', 'array-contains', organizationId));
  const querySnapshot = await getDocs(usersQuery);
  const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return users;
};

// Create a new task
export const createTask = async ({ title, description, assignedToUserId, projectId, organizationId }) => {
  const taskData = {
    title,
    description,
    assignedTo: assignedToUserId,
    projectId,
    organizationId,
    createdAt: new Date(),
    status: 'pending',
  };

  try {
    await addDoc(collection(db, 'tasks'), taskData);
    console.log('Task created successfully');
  } catch (error) {
    console.error('Error creating task:', error);
  }
};
