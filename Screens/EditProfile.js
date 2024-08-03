import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { updateUserProfile } from '../updateUserProfile'; // Adjust the import path

const EditProfile = ({ navigation }) => {
  const [newDisplayName, setNewDisplayName] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = () => {
    launchImageLibrary({
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      includeBase64: false,
    }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setImage(response.assets[0].uri);
      }
    });
  };

  const handleSaveProfile = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    try {
      let photoURL = currentUser.photoURL;
      if (image) {
        const storage = getStorage();
        const storageRef = ref(storage, `profiles/${currentUser.uid}`);
        const img = await fetch(image);
        const bytes = await img.blob();
        await uploadBytes(storageRef, bytes);
        photoURL = await getDownloadURL(storageRef);
      }

      await updateUserProfile(newDisplayName, photoURL);
      Alert.alert('Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error updating profile:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 150 }} />
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: image || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter new display name"
        placeholderTextColor="#888"
        value={newDisplayName}
        onChangeText={setNewDisplayName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
    width: '80%',
  },
  button: {
    backgroundColor: '#0d6efd',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '80%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default EditProfile;
