import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OrganizationContext } from '../context/OrganizationContext';

const ExistingOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedOrganizationId } = useContext(OrganizationContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const user = auth.currentUser;
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);

          if (userData.organizations) {
            console.log("Organizations array:", userData.organizations);
            // Trim organization names to remove trailing spaces
            const trimmedOrganizations = userData.organizations.map(org => org.trim());
            setOrganizations(trimmedOrganizations);
          } else {
            setOrganizations([]);
          }
        }
      } catch (error) {
        Alert.alert('Error fetching organizations', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleDelete = async (organizationName) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);

      // Remove organization from the user's document
      await updateDoc(userRef, {
        organizations: arrayRemove(organizationName),
      });

      // Remove organization from state
      setOrganizations((prevOrganizations) =>
        prevOrganizations.filter((org) => org !== organizationName)
      );

      Alert.alert('Organization deleted successfully');
    } catch (error) {
      Alert.alert('Error deleting organization', error.message);
    }
  };

 const handleOrganizationPress = (organizationName) => {
  setSelectedOrganizationId(organizationName);
  navigation.reset({
    index: 0,
    routes: [{ name: 'MainHome', params: { organizationName } }],
  });
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
      <View style={{ marginBottom: 10 }} />
      <Text style={styles.title}>Existing Organizations</Text>
      <FlatList
        data={organizations}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleOrganizationPress(item)}>
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.organizationText}>{item}</Text>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Ionicons name="trash-bin" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#0d6efd',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#DADADA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizationText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
});

export default ExistingOrganizations;
