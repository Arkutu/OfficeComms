import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import moment from 'moment';

const ChatbotScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });

    // Add Ned's introduction
    const introMessage = {
      id: 'intro',
      text: "Hello! I'm Ned, your AI assistant. How can I help you today?",
      sender: 'bot',
      createdAt: new Date(),
      name: 'Ned',
      avatar: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Ned'
    };
    setMessages([introMessage]);
  }, []);

  const handleSendMessage = async () => {
    if (message.trim() === '') {
      Alert.alert('Message cannot be empty.');
      return;
    }

    const newMessage = {
      id: Math.random().toString(36).substring(7),
      text: message,
      sender: 'user',
      createdAt: new Date(),
      name: 'You',
    };

    setMessages([...messages, newMessage]);
    setMessage('');
    scrollViewRef.current?.scrollToEnd({ animated: true });

    try {
      const res = await axios.post('http://chatbot-env.eba-umqwe8hv.eu-north-1.elasticbeanstalk.com/chat', {
        message: newMessage.text
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const botResponse = res.data.response;
      const newBotMessage = {
        id: Math.random().toString(36).substring(7),
        text: botResponse,
        sender: 'bot',
        createdAt: new Date(),
        name: 'Ned',
        avatar: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Ned'
      };

      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      Alert.alert('Error sending message to chatbot.');
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.channelName}>Chatbot</Text>
          </View>
        </View>
        <ScrollView style={styles.messageList} ref={scrollViewRef}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <View key={msg.id} style={[styles.messageContainer, msg.sender === 'user' ? styles.myMessage : styles.botMessage]}>
                {msg.sender === 'bot' && <Image source={{ uri: msg.avatar }} style={styles.avatar} />}
                <View style={styles.messageContent}>
                  <Text style={styles.messageName}>{msg.name}</Text>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.messageTime}>{moment(msg.createdAt).fromNow()}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noMessagesText}>No messages yet. Start the conversation!</Text>
          )}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Type a message"
            placeholderTextColor="#999"
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={handleSendMessage}
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="#FFF" style={styles.sendButton} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    padding: 10,
    backgroundColor: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#3E497A',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  channelName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  noMessagesText: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContent: {
    maxWidth: '80%',
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    marginLeft: 10,
  },
  messageName: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  messageTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    borderTopWidth: 1,
    borderTopColor: '#3E497A',
  },
  messageInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#101223',
    borderRadius: 20,
    color: 'white',
  },
  sendButton: {
    backgroundColor: '#3E497A',
    padding: 10,
    borderRadius: 20,
    marginLeft: 5,
  },
});

export default ChatbotScreen;
