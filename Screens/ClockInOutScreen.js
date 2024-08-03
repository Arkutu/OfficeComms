import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, addDoc, Timestamp, query, where, getDocs, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserContext } from '../context/UserContext';

const ClockInOutScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [attendanceDocId, setAttendanceDocId] = useState(null);

  useEffect(() => {
    const checkIfClockedIn = async () => {
      const q = query(
        collection(db, 'attendance'),
        where('userId', '==', user.uid),
        orderBy('clockIn', 'desc'),
        limit(1)
      );
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          if (latestDoc.data().clockOut === null) {
            setClockedIn(true);
            setClockInTime(latestDoc.data().clockIn);
            setAttendanceDocId(latestDoc.id);
          }
        }
      } catch (error) {
        console.error('Error checking if clocked in:', error);
      }
    };

    checkIfClockedIn().catch((error) => console.error('Error in useEffect:', error));
  }, [user.uid]);

  const handleClockIn = async () => {
    const currentTime = Timestamp.now();
    setClockInTime(currentTime);
    setClockedIn(true);

    try {
      const docRef = await addDoc(collection(db, 'attendance'), {
        userId: user.uid,
        clockIn: currentTime,
        clockOut: null,
      });
      setAttendanceDocId(docRef.id);
    } catch (error) {
      console.error('Error clocking in:', error);
    }
  };

  const handleClockOut = async () => {
    const currentTime = Timestamp.now();
    setClockedIn(false);

    try {
      await updateDoc(doc(db, 'attendance', attendanceDocId), {
        clockOut: currentTime,
      });
    } catch (error) {
      console.error('Error clocking out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 30 }} />
      <View style={styles.headerContainer}>
        {user.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatar} />
        )}
        <Text style={styles.name}>{user.displayName || 'User Name'}</Text>
      </View>
      <Text style={styles.title}>Attendance Management</Text>
      <View style={styles.buttonContainer}>
        {!clockedIn ? (
          <TouchableOpacity style={styles.button} onPress={handleClockIn}>
            <Text style={styles.buttonText}>Clock In</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.clockOutButton]} onPress={handleClockOut}>
            <Text style={styles.buttonText}>Clock Out</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LeaveRequestScreen')}>
          <Text style={styles.buttonText}>Request Leave</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AttendanceChart')}>
          <Text style={styles.buttonText}>View Attendance Chart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
    color: '#000',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#034BAD',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    marginBottom: 10,
  },
  clockOutButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
  },
});

export default ClockInOutScreen;
