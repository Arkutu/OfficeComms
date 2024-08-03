import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { 
  check, 
  request, 
  PERMISSIONS, 
  RESULTS 
} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PermissionItem = ({ title, description, icon, isEnabled, onToggle }) => (
  <View style={styles.permissionItem}>
    <View style={styles.permissionHeader}>
      <Icon name={icon} size={24} color="#4a4a4a" style={styles.icon} />
      <Text style={styles.permissionTitle}>{title}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggle}
        value={isEnabled}
      />
    </View>
    <Text style={styles.permissionDescription}>{description}</Text>
  </View>
);

const PermissionsScreen = () => {
  const navigation = useNavigation();
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    const cameraStatus = await check(PERMISSIONS.IOS.CAMERA);
    setCameraPermission(cameraStatus === RESULTS.GRANTED);

    const locationStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    setLocationPermission(locationStatus === RESULTS.GRANTED);

    const microphoneStatus = await check(PERMISSIONS.IOS.MICROPHONE);
    setMicrophonePermission(microphoneStatus === RESULTS.GRANTED);

    const notificationStatus = await check(PERMISSIONS.IOS.NOTIFICATIONS);
    setNotificationPermission(notificationStatus === RESULTS.GRANTED);
  };

  const handleTogglePermission = async (permissionType) => {
    let permission;
    let setPermissionState;

    switch (permissionType) {
      case 'camera':
        permission = PERMISSIONS.IOS.CAMERA;
        setPermissionState = setCameraPermission;
        break;
      case 'location':
        permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        setPermissionState = setLocationPermission;
        break;
      case 'microphone':
        permission = PERMISSIONS.IOS.MICROPHONE;
        setPermissionState = setMicrophonePermission;
        break;
      case 'notification':
        permission = PERMISSIONS.IOS.NOTIFICATIONS;
        setPermissionState = setNotificationPermission;
        break;
      default:
        return;
    }

    try {
      const result = await request(permission);
      if (result === RESULTS.GRANTED) {
        setPermissionState(true);
      } else {
        setPermissionState(false);
        Alert.alert(
          "Permission Denied",
          `Please enable ${permissionType} permission in your device settings to use this feature.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>App Permissions</Text>
      <ScrollView style={styles.scrollView}>
        <PermissionItem
          title="Camera"
          description="Allow the app to take photos and record video."
          icon="camera-alt"
          isEnabled={cameraPermission}
          onToggle={() => handleTogglePermission('camera')}
        />
        <PermissionItem
          title="Location"
          description="Allow the app to access your location."
          icon="location-on"
          isEnabled={locationPermission}
          onToggle={() => handleTogglePermission('location')}
        />
        <PermissionItem
          title="Microphone"
          description="Allow the app to record audio."
          icon="mic"
          isEnabled={microphonePermission}
          onToggle={() => handleTogglePermission('microphone')}
        />
        <PermissionItem
          title="Notifications"
          description="Allow the app to send you notifications."
          icon="notifications"
          isEnabled={notificationPermission}
          onToggle={() => handleTogglePermission('notification')}
        />
      </ScrollView>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  permissionItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#4a4a4a',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#666',
  },
  backButton: {
    backgroundColor: '#034BAD',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PermissionsScreen;