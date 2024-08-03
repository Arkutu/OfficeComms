import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const JoinMeetingScreen = ({ navigation }) => {
    const [callID, setCallID] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false); // Add loading state

    const handleJoinMeeting = () => {
        if (!callID) {
            Alert.alert('Please enter a call ID');
            return;
        }
        
        setButtonLoading(true); // Start loading

        try {
            // Navigate to the VideoCall screen with the entered call ID
            navigation.navigate('VideoCall', { callID });

            setButtonLoading(false); // Stop loading
        } catch (error) {
            setButtonLoading(false); // Stop loading
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join a Meeting</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter Call ID"
                placeholderTextColor="#888"
                value={callID}
                onChangeText={setCallID}
            />

            <View style={{ marginBottom: 20 }} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleJoinMeeting}
                    disabled={buttonLoading}
                >
                    {buttonLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Join Meeting</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        color: '#0d6efd',
        textAlign: 'center',
        marginBottom: 20,
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
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    button: {
        backgroundColor: '#0d6efd',
        paddingVertical: 15,
        borderRadius: 25,
        alignItems: 'center',
        width: '90%',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
});

export default JoinMeetingScreen;
