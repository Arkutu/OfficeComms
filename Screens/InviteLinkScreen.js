// InviteLinkScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { handleInvitationLink } from '../invitationUtils'; // Ensure the path is correct
import { getAuth } from 'firebase/auth';

const InviteLinkScreen = ({ navigation }) => {
  const [inviteLink, setInviteLink] = useState('');

  const handleJoinOrganization = async () => {
    try {
      const linkId = inviteLink.replace('officecomms://join/', '').trim();
      console.log('Extracted link ID:', linkId); // Debug log

      const auth = getAuth();
      const userId = auth.currentUser.uid;

      const { organizationName, linkId: id } = await handleInvitationLink(linkId, userId);
      navigation.navigate('MainHome', { organizationName, linkId: id });
    } catch (error) {
      console.error('Error handling invitation link:', error); // Debug log
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Organization</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter invite link"
        value={inviteLink}
        onChangeText={setInviteLink}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinOrganization}>
        <Text style={styles.buttonText}>Join Organization</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#034BAD',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#DADADA',
  },
  button: {
    backgroundColor: '#034BAD',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default InviteLinkScreen;
