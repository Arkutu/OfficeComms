import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Loading from '../components/Loading'; // Adjust the import path as needed
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('Login', { from: 'Welcome' });
      setLoading(false);
    }, 500); // Simulate loading time for smooth transition
  };

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      navigation.navigate('CreateNewAccount', { from: 'Welcome' });
      setLoading(false);
    }, 500); // Simulate loading time for smooth transition
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        {loading && <Loading />}
        <Image
          source={require('../assets/OfficeComms.png')} // Replace with your logo path
          style={styles.logo}
        />
        <View style={styles.mainContainer}>
          <View style={styles.topContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.nextText}>Get started with your account</Text>
          </View>
          <View style={styles.btnTwoContainer}>
            <Pressable style={styles.btnTwo} onPress={handleSignUp}>
              <Text style={styles.btnText}>Sign up</Text>
            </Pressable>
            <Pressable style={styles.btnThree} onPress={handleSignIn}>
              <Text style={styles.btnText}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  mainContainer: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#545454',
    position: 'absolute',
    bottom: -40,
  },
  topContainer: {
    alignItems: 'center',
    color: '#FFFFFF',
  },
  welcomeText: {
    fontSize: 30,
    marginTop: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  nextText: {
    fontSize: 18,
    color: '#FFFFFF',
    margin: 10,
  },
  btn: {
    marginHorizontal: 30,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnTwoContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  btnTwo: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#034BAD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  btnThree: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#034BAD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default Welcome;
