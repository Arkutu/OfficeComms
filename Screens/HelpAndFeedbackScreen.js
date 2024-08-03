import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HelpAndFeedbackScreen = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (subject.trim() === '' || message.trim() === '') {
      Alert.alert('Error', 'Please fill in both subject and message fields.');
      return;
    }

    const email = 'officecomms24@gmail.com';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Error', "Can't handle this operation");
        } else {
          return Linking.openURL(mailtoUrl);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Help and Feedback</Text>
        </View>
        
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Subject"
            placeholderTextColor="#999"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={[styles.inputContainer, styles.messageInputContainer]}>
          <Ionicons name="chatbubble-outline" size={24} color="#007AFF" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Your message"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Send Feedback</Text>
          <Ionicons name="send" size={24} color="#fff" style={styles.submitButtonIcon} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    padding: 10,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#007AFF',
    marginRight: 34, // To center the title accounting for the back button
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    color: '#333',
    fontSize: 16,
  },
  messageInputContainer: {
    alignItems: 'flex-start',
  },
  messageInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  submitButtonIcon: {
    marginLeft: 10,
  },
});

export default HelpAndFeedbackScreen;
