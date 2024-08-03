import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

const MeetingScreen = ({ navigation }) => {
    const [callID, setCallID] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false); // Add loading state

    const handleCreateMeeting = async () => {
        setButtonLoading(true); // Start loading
        try {
            if (!callID) {
                Alert.alert('Please enter a call ID');
                setButtonLoading(false); // Stop loading
                return;
            }
            
            // Navigate to the VideoCall screen with the entered call ID
            navigation.navigate('VideoCall', { callID });

            setButtonLoading(false); // Stop loading
        } catch (error) {
            setButtonLoading(false); // Stop loading
            Alert.alert('Error', error.message);
        }
    };

    const handleJoinMeeting = () => {
        if (!callID) {
            Alert.alert('Please enter a call ID');
            return;
        }
        
        // Navigate to the VideoCall screen with the entered call ID
        navigation.navigate('VideoCall', { callID });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meeting </Text>

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
                    onPress={handleCreateMeeting}
                    disabled={buttonLoading}
                >
                    {buttonLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Create Meeting</Text>
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
        marginBottom: 10,
    },
    joinButton: {
        backgroundColor: '#6c757d',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
    },
});

export default MeetingScreen;
