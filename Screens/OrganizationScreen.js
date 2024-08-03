import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  Clipboard 
} from 'react-native';
import { doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { createInvitationLink } from '../invitationUtils';

const OrganizationScreen = ({ navigation }) => {
  const [organizationName, setOrganizationName] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState('');

  const handleCreateOrganization = async () => {
    if (!organizationName) {
      Alert.alert('Please enter an organization name');
      return;
    }

    setButtonLoading(true);
    try {
      const user = auth.currentUser;

      const organizationRef = doc(db, 'organizations', organizationName);
      await setDoc(organizationRef, {
        name: organizationName,
        createdBy: user.uid,
        members: [user.uid],
        createdAt: new Date(),
      });

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        organizations: arrayUnion(organizationName),
      });

      const invitationLink = await createInvitationLink(organizationName);
      setInviteLink(invitationLink);

      Clipboard.setString(invitationLink);

      Alert.alert(
        'Success',
        'Organization created successfully! The invitation link has been copied to your clipboard.',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('MainHome', { organizationName })
          }
        ]
      );

    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setButtonLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (inviteLink) {
      Clipboard.setString(inviteLink);
      Alert.alert('Copied', 'Invitation link copied to clipboard!');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Create Your Organization</Text>

      <View style={{ marginBottom: 20 }} />

      <TextInput
        style={styles.input}
        placeholder="Enter Organization Name"
        placeholderTextColor="#888"
        value={organizationName}
        onChangeText={setOrganizationName}
      />

      <View style={{ marginBottom: 20 }} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateOrganization}
        >
          {buttonLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create</Text>
          )}
        </TouchableOpacity>
      </View>

      {inviteLink && (
        <TouchableOpacity style={styles.linkButton} onPress={copyInviteLink}>
          <Text style={styles.linkButtonText}>Copy Invite Link</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 40,
    color: '#0d6efd',
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
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
  linkButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  linkButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default OrganizationScreen;