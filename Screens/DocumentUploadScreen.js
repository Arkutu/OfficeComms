import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert, Modal, ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { storage, db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';

const DocumentUploadScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [documentName, setDocumentName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const q = query(collection(db, 'documents'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const docs = [];
      querySnapshot.forEach((doc) => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      setDocuments(docs);
    });
    return () => unsubscribe();
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      uploadDocument(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'Failed to pick document');
      }
    }
  };

  const uploadDocument = async (document) => {
    if (!documentName.trim()) {
      Alert.alert('Error', 'Please enter a document name');
      return;
    }

    setLoading(true);
    const filename = document.name;
    const storageRef = ref(storage, `documents/${filename}`);

    try {
      const response = await fetch(document.uri);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, 'documents'), {
        name: documentName,
        filename: filename,
        url: downloadURL,
        uploadedBy: user.displayName,
        uploadedAt: new Date(),
      });

      setDocumentName('');
      Alert.alert('Success', 'Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.documentItem}
      onPress={() => {
        setSelectedDocument(item);
        setModalVisible(true);
      }}
    >
      <Icon name="insert-drive-file" size={24} color="#034BAD" style={styles.documentIcon} />
      <View style={styles.documentInfo}>
        <Text style={styles.documentName}>{item.name}</Text>
        <Text style={styles.documentSubInfo}>Uploaded by: {item.uploadedBy}</Text>
        <Text style={styles.documentSubInfo}>
          {new Date(item.uploadedAt.toDate()).toLocaleString()}
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document Upload</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter document name"
          placeholderTextColor="#999"
          value={documentName}
          onChangeText={setDocumentName}
        />
        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Icon name="file-upload" size={24} color="#fff" />
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>
      {loading && <ActivityIndicator size="large" color="#034BAD" />}
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id}
        style={styles.documentList}
      />
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{selectedDocument?.name}</Text>
          </View>
          {selectedDocument && (
            <WebView
              source={{ uri: selectedDocument.url }}
              style={styles.webView}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#034BAD',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color: '#000',
    backgroundColor: '#fff',
  },
  uploadButton: {
    backgroundColor: '#034BAD',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  documentList: {
    flex: 1,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  documentIcon: {
    marginRight: 15,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  documentSubInfo: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  webView: {
    flex: 1,
  },
});

export default DocumentUploadScreen;