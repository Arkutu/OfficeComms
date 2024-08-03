// VideoCall.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { ZegoUIKitPrebuiltCall, GROUP_VIDEO_CALL_CONFIG } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { UserContext } from '../context/UserContext';
import KeyCenter from '../KeyCenter';
import uuid from 'uuid-random';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import axios from 'axios';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const VideoCall = ({ route, navigation }) => {
    const { user } = useContext(UserContext);
    const [callID, setCallID] = useState(route.params?.callID || uuid());
    const [isRecording, setIsRecording] = useState(false);
    const [summaryAvailable, setSummaryAvailable] = useState(false);
    const [currentMeetingId, setCurrentMeetingId] = useState(null);
    const audioRecorderPlayer = useRef(new AudioRecorderPlayer());

    useEffect(() => {
        if (!route.params?.callID) {
            navigation.setParams({ callID });
        }
        setCurrentMeetingId(uuid());
    }, [callID, navigation, route.params?.callID]);

    const startRecording = async () => {
        const result = await audioRecorderPlayer.current.startRecorder();
        console.log(result);
        setIsRecording(true);
    };

    const stopRecording = async () => {
        const result = await audioRecorderPlayer.current.stopRecorder();
        console.log(result);
        setIsRecording(false);
        sendAudioToBackend(result);
    };

    const sendAudioToBackend = async (audioPath) => {
        const formData = new FormData();
        formData.append('file', {
            uri: audioPath,
            type: 'audio/mp4',
            name: 'sound.mp4',
        });

        try {
            const response = await axios.post(
                'http://audiosummariz-env.eba-nmjnb2ie.eu-north-1.elasticbeanstalk.com/summarize-call',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (response.data && response.data.summary) {
                await saveTranscriptionToFirebase(response.data.summary);
                setSummaryAvailable(true);
            }
        } catch (error) {
            console.error('Error sending audio to backend:', error);
        }
    };

    const saveTranscriptionToFirebase = async (summary) => {
        try {
            const docRef = await addDoc(collection(db, "transcriptions"), {
                userId: auth.currentUser.uid,
                meetingId: currentMeetingId,
                summary: summary,
                timestamp: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    if (!user) {
        return null; // Or a loading spinner
    }

    return (
        <View style={styles.container}>
            <ZegoUIKitPrebuiltCall
                appID={KeyCenter.appID}
                appSign={KeyCenter.appSign}
                userID={user.uid}
                userName={user.displayName}
                callID={callID}
                config={{
                    ...GROUP_VIDEO_CALL_CONFIG,
                    onCallEnd: (callID, reason, duration) => {
                        navigation.navigate('OfficeScreen');
                    },
                    timingConfig: {
                        isDurationVisible: true,
                        onDurationUpdate: (duration) => {
                            console.log('Call duration:', duration);
                            if (duration === 10 * 60) {
                                ZegoUIKitPrebuiltCallService.hangUp();
                            }
                        }
                    },
                    avatarBuilder: ({ userInfo }) => (
                        <View style={{ width: '100%', height: '100%' }}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                                source={{ uri: user.photoURL || 'https://via.placeholder.com/150' }}
                            />
                        </View>
                    ),
                }}
            />
            <TouchableOpacity
                style={styles.recordButton}
                onPress={isRecording ? stopRecording : startRecording}
            >
                <Text style={styles.recordButtonText}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </Text>
            </TouchableOpacity>
            {summaryAvailable && (
                <TouchableOpacity
                    style={styles.summaryButton}
                    onPress={() => navigation.navigate('SummaryScreen', { meetingId: currentMeetingId })}
                >
                    <Text style={styles.summaryButtonText}>View Summary</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
    },
    recordButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    recordButtonText: {
        color: 'white',
    },
    summaryButton: {
        position: 'absolute',
        bottom: 80,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    summaryButtonText: {
        color: 'white',
    },
});

export default VideoCall;