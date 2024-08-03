import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CreateOrganization = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
       <Image
        source={require('../assets/OfficeComms.png')} // Replace with your logo path
        style={styles.logo}
      />

      <View style={{ marginTop: 10 }} />

      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeTitle}>Create Organization</Text>
        <Text style={styles.welcomeSubtitle}>Get started with creating your organization</Text>

        <View style={{ marginBottom: 1 }} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrganizationScreen')}>
            <Text style={styles.buttonText}>Create New Organization</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExistingOrganizations')}>
            <Text style={styles.buttonText}>Existing Organizations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('InviteLinkScreen')}>
            <Text style={styles.buttonText}>Invite Link</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: '#FFFFFF',
    marginBottom: 50,
    fontWeight: 'bold',
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 2,
  },
  welcomeContainer: {
    backgroundColor: '#545454',
    borderRadius: 35,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    height: '70%',
    marginBottom: -300,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 40,
  },
  buttonContainer: {
     width: '80%',
     alignItems: 'center',
   
  },
  button: {
    backgroundColor: '#034BAD',
    paddingVertical: 15,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
     width: '130%',
    
    
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
   logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },

});

export default CreateOrganization;
