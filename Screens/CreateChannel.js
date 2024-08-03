import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';

const CreateChannel = ({ navigation }) => {
  const [channelName, setChannelName] = useState('');
  const { user } = useContext(UserContext);

  const handleCreateChannel = async (visibility) => {
    const newChannel = {
      name: channelName,
      visibility,
      members: visibility === 'Private' ? [user.uid] : [],
      createdAt: Timestamp.now()
    };
    await addDoc(collection(db, 'channels'), newChannel);
    navigation.navigate('ChannelBrowser');
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 40 }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ChannelVisibility', { channelName })}>
          <Text style={styles.nextButton}>Next</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. project-pigeon"
        value={channelName}
        onChangeText={setChannelName}
      />
      <Text style={styles.helperText}>
        Channels are where conversations happen around a topic. Use a name that’s easy to find and understand.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00072d',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nextButton: {
    color: '#FFF',
    fontSize: 16,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2b2b40',
    borderRadius: 8,
    padding: 10,
    color: '#FFF',
    marginBottom: 20,
  },
  helperText: {
    color: '#888',
    fontSize: 14,
  },
});

export default CreateChannel;
