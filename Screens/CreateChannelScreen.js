import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';
import { OrganizationContext } from '../context/OrganizationContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CreateChannelScreen = ({ navigation }) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [visibility, setVisibility] = useState('Public');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const { user } = useContext(UserContext);
  const { selectedOrganizationId } = useContext(OrganizationContext);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedOrganizationId) return;

      try {
        const orgDoc = await getDoc(doc(db, 'organizations', selectedOrganizationId));
        if (!orgDoc.exists()) return;

        const membersData = orgDoc.data().members || [];
        const userPromises = membersData.map(memberId => getDoc(doc(db, 'users', memberId)));
        const users = await Promise.all(userPromises);
        const members = users.map(user => ({
          uid: user.id,
          displayName: user.data().displayName,
        }));
        setMembers(members);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, [selectedOrganizationId]);

  const handleCreateChannel = async () => {
    if (channelName.trim()) {
      const newChannel = {
        name: channelName,
        description: channelDescription,
        visibility: visibility,
        createdAt: new Date(),
        createdBy: user.uid,
        members: visibility === 'Private' ? [user.uid, ...selectedUsers] : [user.uid],
        organizationId: selectedOrganizationId,
      };

      try {
        await addDoc(collection(db, 'channels'), newChannel);
        navigation.goBack();
      } catch (error) {
        console.error('Error creating channel:', error);
      }
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId)
        : [...prevSelected, userId]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Channel Name</Text>
      <TextInput
        style={styles.input}
        value={channelName}
        onChangeText={setChannelName}
        placeholder="Enter channel name"
        placeholderTextColor="#888"
      />
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        value={channelDescription}
        onChangeText={setChannelDescription}
        placeholder="Enter channel description"
        placeholderTextColor="#888"
      />
      <Text style={styles.label}>Visibility</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={visibility}
          onValueChange={(itemValue) => setVisibility(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Public" value="Public" />
          <Picker.Item label="Private" value="Private" />
        </Picker>
      </View>
     
      {visibility === 'Private' && (
        <ScrollView style={styles.memberList}>
          <Text style={styles.label}>Select Users</Text>
          {members.map((member) => (
            <TouchableOpacity
              key={member.uid}
              style={[
                styles.memberItem,
                selectedUsers.includes(member.uid) && styles.selectedMemberItem,
              ]}
              onPress={() => toggleUserSelection(member.uid)}
            >
              <Text style={styles.memberName}>{member.displayName}</Text>
              <Switch
                value={selectedUsers.includes(member.uid)}
                onValueChange={() => toggleUserSelection(member.uid)}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={selectedUsers.includes(member.uid) ? "#f5dd4b" : "#f4f3f4"}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.button} onPress={handleCreateChannel}>
        <Text style={styles.buttonText}>Create Channel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  label: {
    color: '#333',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F0F0F0',
    color: '#333',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  pickerContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 20,
  },
  picker: {
    color: '#333',
  },
  button: {
    backgroundColor: '#0d6efd',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  memberList: {
    maxHeight: 200,
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  selectedMemberItem: {
    backgroundColor: '#E6F2FF',
  },
  memberName: {
    color: '#333',
    fontSize: 16,
  },
});

export default CreateChannelScreen;
