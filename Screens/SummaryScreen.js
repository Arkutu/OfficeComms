import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SummaryScreen = () => {
    const [summaries, setSummaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSummary, setSelectedSummary] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        loadSummaries();
    }, []);

    const loadSummaries = async () => {
        try {
            const q = query(
                collection(db, "transcriptions"),
                where("userId", "==", auth.currentUser.uid),
                orderBy("timestamp", "desc")
            );
            const querySnapshot = await getDocs(q);
            const loadedSummaries = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setSummaries(loadedSummaries);
        } catch (e) {
            console.error("Error loading summaries: ", e);
            setError('Failed to load summaries. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderSummaryItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                setSelectedSummary(item);
                setModalVisible(true);
            }}
            style={styles.summaryItem}
        >
            <Ionicons name="document-text-outline" size={24} color="#034BAD" style={styles.icon} />
            <View style={styles.summaryItemContent}>
                <Text style={styles.summaryItemText}>Meeting {item.meetingId.slice(0, 8)}</Text>
                <Text style={styles.summaryItemDate}>{item.timestamp.toDate().toLocaleString()}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#034BAD" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={styles.loadingText}>Loading summaries...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Meeting Summaries</Text>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : summaries.length > 0 ? (
                    <FlatList
                        data={summaries}
                        renderItem={renderSummaryItem}
                        keyExtractor={item => item.id}
                        style={styles.summaryList}
                    />
                ) : (
                    <Text style={styles.errorText}>No summaries available.</Text>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Meeting {selectedSummary?.meetingId.slice(0, 8)}</Text>
                    <ScrollView style={styles.modalScrollView}>
                        <Text style={styles.modalText}>{selectedSummary?.summary}</Text>
                    </ScrollView>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#034BAD',
    },
    summaryList: {
        flex: 1,
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        marginBottom: 10,
    },
    summaryItemContent: {
        flex: 1,
        marginLeft: 10,
    },
    summaryItemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#034BAD',
    },
    summaryItemDate: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    icon: {
        marginRight: 10,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: '80%',
    },
    modalScrollView: {
        maxHeight: '70%',
        width: '100%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#034BAD',
    },
    modalText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        textAlign: "left",
        marginBottom: 15,
    },
    closeButton: {
        backgroundColor: "#034BAD",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    }
});

export default SummaryScreen;
