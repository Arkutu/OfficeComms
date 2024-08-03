// invitationUtils.js
import uuid from 'uuid-random';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Ensure the path is correct

export const createInvitationLink = async (organizationName) => {
  try {
    const linkId = uuid();
    const link = `officecomms://join/${linkId}`;

    await setDoc(doc(db, 'invitationLinks', linkId), {
      organizationName,
      createdAt: serverTimestamp(),
    });

    return link;
  } catch (error) {
    console.error('Error creating invitation link:', error);
    throw new Error('Failed to create invitation link');
  }
};

export const handleInvitationLink = async (linkId, userId) => {
  try {
    const linkDoc = await getDoc(doc(db, 'invitationLinks', linkId));
    if (!linkDoc.exists()) {
      throw new Error('Invalid invitation link');
    }

    const { organizationName } = linkDoc.data();

    await updateDoc(doc(db, 'organizations', organizationName), {
      members: arrayUnion(userId),
    });

    await updateDoc(doc(db, 'users', userId), {
      organizations: arrayUnion(organizationName),
    });

    return { organizationName, linkId };
  } catch (error) {
    console.error('Error handling invitation link:', error);
    throw new Error('Failed to join organization');
  }
};
