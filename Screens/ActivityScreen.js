import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { UserContext } from '../context/UserContext';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebaseConfig';

const ActivityScreen = ({ navigation }) => {
    const { user, loading: userLoading } = useContext(UserContext);
    const { organizationName: contextOrganizationName } = useAppContext();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    const firstLetter = contextOrganizationName ? contextOrganizationName.charAt(0).toUpperCase() : '';
    const getActiveRoute = () => navigation.getState().routes[navigation.getState().index].name;

    useEffect(() => {
        const fetchActivities = async () => {
            if (user) {
                try {
                    const userId = user.uid;
                    const activityPromises = [
                        fetchProjects(userId),
                        fetchAttendance(userId),
                        fetchDirectMessages(userId),
                        fetchLeaveRequests(userId),
                    ];

                    const results = await Promise.all(activityPromises);
                    const allActivities = results.flat();
                    allActivities.sort((a, b) => b.timestamp - a.timestamp);

                    setActivities(allActivities);
                } catch (error) {
                    console.error('Error fetching activities:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchActivities();
    }, [user]);

    const fetchProjects = async (userId) => {
        const q = query(collection(db, 'Projects'), where('ownerId', '==', userId), orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            type: 'project',
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().updatedAt.toDate(),
        }));
    };

    const fetchAttendance = async (userId) => {
        const q = query(collection(db, 'attendance'), where('userId', '==', userId), orderBy('clockIn', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            type: 'attendance',
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().clockIn.toDate(),
        }));
    };

    const fetchDirectMessages = async (userId) => {
        const q = query(collection(db, 'directMessages'), where('recipientId', '==', userId), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            type: 'directMessage',
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().createdAt.toDate(),
        }));
    };

    const fetchLeaveRequests = async (userId) => {
        const q = query(collection(db, 'leaverequests'), where('userId', '==', userId), orderBy('requestDate', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            type: 'leaveRequest',
            ...doc.data(),
            id: doc.id,
            timestamp: doc.data().requestDate.toDate(),
        }));
    };

    const getActivityDescription = (activity) => {
        switch (activity.type) {
            case 'project':
                return `Project "${activity.name}" was updated.`;
            case 'attendance':
                const clockInTime = activity.clockIn ? activity.clockIn.toDate().toLocaleTimeString() : 'N/A';
                const clockOutTime = activity.clockOut ? activity.clockOut.toDate().toLocaleTimeString() : 'N/A';
                return `You clocked in at ${clockInTime} and clocked out at ${clockOutTime}.`;
            case 'directMessage':
                return `You received a message from ${activity.username}: "${activity.text}".`;
            case 'leaveRequest':
                const leaveStartDate = activity.leaveStartDate ? activity.leaveStartDate.toDate().toLocaleDateString() : 'N/A';
                const leaveEndDate = activity.leaveEndDate ? activity.leaveEndDate.toDate().toLocaleDateString() : 'N/A';
                return `Leave request from ${leaveStartDate} to ${leaveEndDate} - Status: ${activity.status}.`;
            default:
                return 'Unknown activity';
        }
    };

    if (loading || userLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0d6efd" />
            </View>
        );
    }

    const renderItem = ({ item }) => (
        <View>
            <View style={styles.activityItem}>
                <Text style={styles.activityText}>
                    {getActivityDescription(item)}
                </Text>
                <Text style={styles.timestampText}>{item.timestamp.toLocaleString()}</Text>
            </View>
            <View style={styles.separator} />
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.iconText}>{firstLetter}</Text>
                        </View>
                        <Text style={styles.headerTitle}>Activity</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            {user && user.photoURL ? (
                                <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
                            ) : (
                                <Ionicons name="person-circle" size={40} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={activities}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.contentContainer}
                />
            </View>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainHome')}>
                    <Ionicons name="home" size={28} color={getActiveRoute() === 'MainHome' ? '#0d6efd' : '#FFF'} />
                    <Text style={getActiveRoute() === 'MainHome' ? styles.navTextActive : styles.navTextInactive}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OfficeScreen', { organizationName: contextOrganizationName })}>
                    <FontAwesome5 name="briefcase" size={28} color={getActiveRoute() === 'OfficeScreen' ? '#0d6efd' : '#FFF'} />
                    <Text style={getActiveRoute() === 'OfficeScreen' ? styles.navTextActive : styles.navTextInactive}>Office</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Activity')}>
                    <Ionicons name="notifications" size={28} color={getActiveRoute() === 'Activity' ? '#0d6efd' : '#FFF'} />
                    <Text style={getActiveRoute() === 'Activity' ? styles.navTextActive : styles.navTextInactive}>Activity</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                   <Feather name="users" size={28} color={getActiveRoute() === 'Profile' ? '#0d6efd' : '#FFF'} />
                   <Text style={getActiveRoute() === 'Profile' ? styles.navTextActive : styles.navTextInactive}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00072d',
    },
    headerContainer: {
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconContainer: {
        backgroundColor: '#0d6efd',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    activityItem: {
        paddingVertical: 15,
    },
    activityText: {
        color: '#000',
        fontSize: 14,
    },
    timestampText: {
        color: '#000',
        fontSize: 12,
        marginTop: 5,
    },
    separator: {
        height: 1,
        backgroundColor: '#444',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#333',
        paddingVertical: 10,
    },
    navItem: {
        alignItems: 'center',
    },
    navTextActive: {
        color: '#0d6efd',
        fontSize: 12,
        marginTop: 2,
    },
    navTextInactive: {
        color: '#FFF',
        fontSize: 12,
        marginTop: 2,
    },
});

export default ActivityScreen;
