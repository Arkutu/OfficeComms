import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';

const ChannelVisibility = ({ route, navigation }) => {
  const { channelName } = route.params;
  const [visibility, setVisibility] = useState('Public');
  const { user } = useContext(UserContext);

  const createChannel = async () => {
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
        <TouchableOpacity onPress={createChannel}>
          <Text style={styles.createButton}>Create</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Visibility</Text>
      <TouchableOpacity onPress={() => setVisibility('Public')} style={styles.option}>
        <Text style={styles.optionText}>Public - Anyone in OfficeComms</Text>
        {visibility === 'Public' && <Ionicons name="checkmark" size={24} color="#00F" />}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setVisibility('Private')} style={styles.option}>
        <Text style={styles.optionText}>Private - Only specific people</Text>
        {visibility === 'Private' && <Ionicons name="checkmark" size={24} color="#00F" />}
      </TouchableOpacity>
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
  createButton: {
    color: '#FFF',
    fontSize: 16,
  },
  label: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  optionText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
});

export default ChannelVisibility;
