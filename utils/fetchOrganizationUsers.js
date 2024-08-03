import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const fetchOrganizationUsers = async (organizationId) => {
  try {
    console.log('Fetching users for organization:', organizationId);
    const usersQuery = query(collection(db, 'users'), where('organizations', 'array-contains', organizationId));
    const querySnapshot = await getDocs(usersQuery);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Fetched users from Firestore:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export default fetchOrganizationUsers;
