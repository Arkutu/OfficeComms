import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert, Image, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { db, auth, storage } from "../firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, doc, getDoc, Timestamp, where } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import moment from 'moment';
import Video from 'react-native-video';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const ChatScreen = ({ route, navigation }) => {
  const { channelName, channelDescription, memberCount, recipientId, recipientName, isDirectMessage } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [fullScreenVideo, setFullScreenVideo] = useState(null);
  const scrollViewRef = useRef();
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: currentUser.uid,
            displayName: userData.displayName || currentUser.displayName,
            photoURL: userData.photoURL || currentUser.photoURL,
          });
        }
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchUser();
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    let q;
    if (isDirectMessage) {
      q = query(
        collection(db, 'directMessages'),
        where('senderId', 'in', [auth.currentUser.uid, recipientId]),
        where('recipientId', 'in', [auth.currentUser.uid, recipientId]),
        orderBy('createdAt', 'asc')
      );
    } else {
      q = query(collection(db, 'channels', channelName, 'messages'), orderBy('createdAt', 'asc'));
    }
   
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    return () => unsubscribe();
  }, [channelName, recipientId, isDirectMessage]);

  const handleSendMessage = async () => {
    if (message.trim() === '' && !image && !video && !audioUri) {
      Alert.alert('Message cannot be empty.');
      return;
    }

    if (!user) {
      Alert.alert('No user is signed in.');
      return;
    }

    try {
      let mediaUrl = null;
      let mediaType = null;

      if (image) {
        const imageRef = ref(storage, `images/${Date.now()}-${user.uid}`);
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        mediaUrl = await getDownloadURL(imageRef);
        mediaType = 'image';
      } else if (video) {
        const videoRef = ref(storage, `videos/${Date.now()}-${user.uid}`);
        const response = await fetch(video);
        const blob = await response.blob();
        await uploadBytes(videoRef, blob);
        mediaUrl = await getDownloadURL(videoRef);
        mediaType = 'video';
      } else if (audioUri) {
        const audioRef = ref(storage, `audio/${Date.now()}-${user.uid}`);
        const response = await fetch(audioUri);
        const blob = await response.blob();
        await uploadBytes(audioRef, blob);
        mediaUrl = await getDownloadURL(audioRef);
        mediaType = 'audio';
      }

      const messageData = {
        text: message,
        mediaUrl,
        mediaType,
        createdAt: Timestamp.now(),
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
      };

      if (isDirectMessage) {
        await addDoc(collection(db, 'directMessages'), {
          ...messageData,
          senderId: user.uid,
          recipientId: recipientId,
        });
      } else {
        await addDoc(collection(db, 'channels', channelName, 'messages'), messageData);
      }

      setMessage('');
      setImage(null);
      setVideo(null);
      setAudioUri(null);
      setMediaModalVisible(false);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setMediaModalVisible(true);
    }
  };

  const handleCaptureImage = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      setMediaModalVisible(true);
    }
  };

  const handlePickVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: 'video',
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      setVideo(result.assets[0].uri);
      setMediaModalVisible(true);
    }
  };

  const startRecording = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      setRecording(true);
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log('Recording', e);
      });
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setRecording(false);
      setAudioUri(result);
      setMediaModalVisible(true);
      audioRecorderPlayer.removeRecordBackListener();
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };

  const getChatTitle = () => {
    if (isDirectMessage) {
      return recipientName;
    }
    return channelName;
  };

  const getMemberCount = () => {
    if (isDirectMessage) {
      return 1;
    }
    return memberCount;
  };

  const handleImageTap = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const handleVideoTap = (videoUrl) => {
    setFullScreenVideo(videoUrl);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.channelName}>{getChatTitle()}</Text>
            <Text style={styles.memberCount}>{getMemberCount()} member{getMemberCount() !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={handleCaptureImage}>
              <Ionicons name="camera-outline" size={24} color="#FFF" style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="headset" size={24} color="#FFF" style={styles.headerIcon} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={styles.messageList} ref={scrollViewRef}>
          {messages.length > 0 ? (
            messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageContainer,
                  msg.userId === user?.uid ? styles.myMessage : styles.otherMessage
                ]}
              >
                <Image source={{ uri: msg.userPhoto || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                <View style={[
                  styles.messageContent,
                  msg.userId === user?.uid ? styles.myMessageContent : styles.otherMessageContent
                ]}>
                  <Text style={styles.messageAuthor}>{msg.userName || 'User'}</Text>
                  {msg.mediaType === 'image' && (
                    <TouchableOpacity onPress={() => handleImageTap(msg.mediaUrl)}>
                      <Image source={{ uri: msg.mediaUrl }} style={styles.messageImage} />
                    </TouchableOpacity>
                  )}
                  {msg.mediaType === 'video' && (
                    <TouchableOpacity onPress={() => handleVideoTap(msg.mediaUrl)}>
                      <Video
                        source={{ uri: msg.mediaUrl }}
                        style={styles.messageVideo}
                        useNativeControls
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  )}
                  {msg.mediaType === 'audio' && (
                    <TouchableOpacity
                      onPress={() => {
                        audioRecorderPlayer.startPlayer(msg.mediaUrl);
                      }}
                    >
                      <Ionicons name="play-circle" size={24} color="white" />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.messageTimestamp}>{moment(msg.createdAt.toDate()).fromNow()}</Text>
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
          <TouchableOpacity onPress={handlePickImage}>
            <Ionicons name="image-outline" size={24} color="#999" style={styles.mediaButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePickVideo}>
            <Ionicons name="videocam-outline" size={24} color="#999" style={styles.mediaButton} />
          </TouchableOpacity>
          {recording ? (
            <TouchableOpacity onPress={stopRecording}>
              <Ionicons name="stop-circle" size={24} color="red" style={styles.mediaButton} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={startRecording}>
              <Ionicons name="mic-outline" size={24} color="#999" style={styles.mediaButton} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="#FFF" style={styles.sendButton} />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={mediaModalVisible}
          onRequestClose={() => {
            setMediaModalVisible(!mediaModalVisible);
          }}
        >
          <View style={styles.modalView}>
            {image && (
              <Image source={{ uri: image }} style={styles.modalImage} />
            )}
            {video && (
              <Video
                source={{ uri: video }}
                style={styles.modalVideo}
                useNativeControls
                resizeMode="contain"
              />
            )}
            {audioUri && (
              <Text style={styles.modalText}>Audio recorded.</Text>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setMediaModalVisible(false)}
            >
              <Ionicons name="close-circle" size={32} color="red" />
            </TouchableOpacity>
            {image || video || audioUri ? (
              <TouchableOpacity
                style={styles.sendModalButton}
                onPress={handleSendMessage}
              >
                <Text style={styles.sendModalButtonText}>Send</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </Modal>
        <Modal
          visible={fullScreenImage !== null}
          transparent={true}
          onRequestClose={() => setFullScreenImage(null)}
        >
          <View style={styles.fullScreenImageContainer}>
            <TouchableOpacity 
              style={styles.closeFullScreenButton} 
              onPress={() => setFullScreenImage(null)}
            >
              <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            <Image 
              source={{ uri: fullScreenImage }} 
              style={styles.fullScreenImage} 
              resizeMode="contain"
            />
          </View>
        </Modal>
        <Modal
          visible={fullScreenVideo !== null}
          transparent={true}
          onRequestClose={() => setFullScreenVideo(null)}
        >
          <View style={styles.fullScreenVideoContainer}>
            <TouchableOpacity 
              style={styles.closeFullScreenButton} 
              onPress={() => setFullScreenVideo(null)}
            >
              <Ionicons name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            <Video 
              source={{ uri: fullScreenVideo }} 
              style={styles.fullScreenVideo} 
              resizeMode="contain"
              useNativeControls
            />
          </View>
        </Modal>
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
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  channelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  memberCount: {
    fontSize: 14,
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 10,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
  },
  myMessageContent: {
    backgroundColor: '#034BAD',
  },
  otherMessageContent: {
    backgroundColor: '#545454',
  },
  messageAuthor: {
    fontWeight: 'bold',
    color: 'white',
  },
  messageText: {
    color: 'white',
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageVideo: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginVertical: 5,
  },
  messageTimestamp: {
    fontSize: 10,
    color: '#999',
    textAlign: 'right',
  },
  noMessagesText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
  },
  messageInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#444',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: 'white',
  },
  mediaButton: {
    marginLeft: 10,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#00f',
    padding: 10,
    borderRadius: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalVideo: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
  },
  closeModalButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  sendModalButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#00f',
    padding: 10,
    borderRadius: 20,
  },
  sendModalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullScreenImageContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenVideoContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  closeFullScreenButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});


export default ChatScreen;