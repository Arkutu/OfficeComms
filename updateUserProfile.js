import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const updateUserProfile = async (displayName, photoURL) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      // Update user profile in Firestore
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: displayName,
        photoURL: photoURL,
      });

      // Update the user profile in Firebase Authentication
      await updateProfile(currentUser, {
        displayName: displayName,
        photoURL: photoURL,
      });

      console.log('User profile updated successfully!');
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  } else {
    console.error('No user is signed in.');
  }
};
