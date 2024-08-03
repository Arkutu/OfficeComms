import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';

const defaultChannels = [
  { name: 'general', description: 'General channel for general discussions.', visibility: 'Public' },
  { name: 'meeting', description: 'Channel for meetings.', visibility: 'Public' },
  { name: 'random', description: 'Channel for random discussions.', visibility: 'Public' },
];

const ChannelBrowser = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [channels, setChannels] = useState(defaultChannels);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchChannels = async () => {
      const querySnapshot = await getDocs(collection(db, 'channels'));
      const channelsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const allChannels = [...defaultChannels, ...channelsData];
      setChannels(allChannels);
    };

    fetchChannels();
  }, []);

  const handleAddChannel = async () => {
    const newChannel = {
      name: `new-channel-${Date.now()}`,
      description: 'Newly created channel.',
      visibility: 'Public',
      createdAt: new Date(),
    };
    await addDoc(collection(db, 'channels'), newChannel);
    setChannels(prevChannels => [...prevChannels, newChannel]);
  };

  const filteredChannels = channels.filter(channel =>
    channel.name && channel.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Workspace Browser</Text>
          <Text style={styles.memberCount}>{channels.length} channels</Text>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for channels"
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <ScrollView style={styles.channelList}>
        {filteredChannels.map((channel, index) => (
          <TouchableOpacity
            key={index}
            style={styles.channelItem}
            onPress={() => navigation.navigate('Chat', { channelName: channel.name, channelDescription: channel.description })}
          >
            <Text style={styles.channelName}>#{channel.name}</Text>
            <Text style={styles.channelStatus}>
              {channel.visibility === 'Public'
                ? 'Public Channel'
                : `Private Channel - ${channel.members?.length || 0} members`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateChannelScreen')}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberCount: {
    color: '#888',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DADADA',
    paddingHorizontal: 15,
    paddingVertical: 10,
    
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    fontSize: 16,
  },
  channelList: {
    flex: 1,
  },
  channelItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  channelName: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  channelStatus: {
    color: '#888',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#034BAD',
    borderRadius: 30,
    padding: 15,
  },
});

export default ChannelBrowser;
