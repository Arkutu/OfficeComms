import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { UserContext } from '../context/UserContext';
import { OrganizationContext } from '../context/OrganizationContext';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const MembersScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { selectedOrganizationId } = useContext(OrganizationContext);
  const { selectedMembers, setSelectedMembers } = useAppContext();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!selectedOrganizationId) {
        console.log('No organization selected');
        setLoading(false);
        return;
      }

      console.log('Selected Organization ID:', selectedOrganizationId);
      try {
        const orgDoc = await getDoc(doc(db, 'organizations', selectedOrganizationId.trim()));
        if (!orgDoc.exists()) {
          console.log('Organization document does not exist');
          setMembers([]);
          return;
        }

        const membersData = orgDoc.data().members || [];
        console.log('Members Data:', membersData);

        if (membersData.length === 0) {
          console.log('No members in the organization');
          setMembers([]);
          return;
        }

        const userPromises = membersData.map(memberId => getDoc(doc(db, 'users', memberId)));
        const users = await Promise.all(userPromises);
        const members = users.map(user => ({
          uid: user.id,
          displayName: user.data().displayName,
        }));
        console.log('Fetched Members:', members);
        setMembers(members);
      } catch (error) {
        console.error('Error fetching members:', error);
        Alert.alert('Error', 'Failed to fetch members.');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedOrganizationId]);

  const toggleSelectMember = (member) => {
    setSelectedMembers(prevSelected =>
      prevSelected.includes(member.uid)
        ? prevSelected.filter(id => id !== member.uid)
        : [...prevSelected, member.uid]
    );
  };

  const handleAddMembers = () => {
    navigation.navigate('MainHome', { selectedMembers });
  };

  const startChat = (member) => {
    navigation.navigate('Chat', { recipientId: member.uid, recipientName: member.displayName });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0d6efd" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Members</Text>
        {selectedMembers.length > 0 && (
          <TouchableOpacity onPress={handleAddMembers}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView>
        {members.map((member, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.memberItem,
              selectedMembers.includes(member.uid) && styles.selectedMemberItem,
            ]}
            onPress={() => toggleSelectMember(member)}
          >
            <Text style={styles.memberName}>{member.displayName}</Text>
            <TouchableOpacity onPress={() => startChat(member)} style={styles.chatIcon}>
              
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    marginBottom: 20,
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addText: {
    color: '#0d6efd',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 150,
  },
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedMemberItem: {
    backgroundColor: '#0d6efd',
  },
  memberName: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  chatIcon: {
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00072d',
  },
});

export default MembersScreen;
