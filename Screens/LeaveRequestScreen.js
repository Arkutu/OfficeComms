import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';

const LeaveRequestScreen = () => {
  const { user } = useContext(UserContext);
  const [leaveStartDate, setLeaveStartDate] = useState('');
  const [leaveEndDate, setLeaveEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'leaverequests'), {
        userId: user.uid,
        requestDate: Timestamp.now(),
        leaveStartDate: Timestamp.fromDate(new Date(leaveStartDate)),
        leaveEndDate: Timestamp.fromDate(new Date(leaveEndDate)),
        status: 'pending',
        reason: reason,
      });
      setLeaveStartDate('');
      setLeaveEndDate('');
      setReason('');
      alert('Leave request submitted successfully!');
    } catch (error) {
      console.error('Error submitting leave request:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submit Leave Request</Text>
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={leaveStartDate}
        onChangeText={setLeaveStartDate}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={leaveEndDate}
        onChangeText={setLeaveEndDate}
        placeholderTextColor="#888"
      />
      <TextInput
        style={styles.input}
        placeholder="Reason"
        value={reason}
        onChangeText={setReason}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    color: '#034BAD',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    color: '#FFF',
    backgroundColor: '#1a1a2e',
  },
  button: {
    backgroundColor: '#034BAD',
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

export default LeaveRequestScreen;
