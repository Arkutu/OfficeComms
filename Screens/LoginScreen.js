import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Enter email and password');
    } else {
      setButtonLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user information in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "",
          lastLogin: new Date(),
        }, { merge: true });

        Alert.alert('Success', 'Login successful!');
        setButtonLoading(false);
        navigation.navigate('CreateOrganization');
      } catch (error) {
        setButtonLoading(false);
        Alert.alert('Error', error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    setButtonLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Update user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Anonymous",
        photoURL: user.photoURL || "",
        lastLogin: new Date(),
      }, { merge: true });

      Alert.alert('Success', 'Login successful!');
      setButtonLoading(false);
      navigation.navigate('CreateOrganization');
    } catch (error) {
      setButtonLoading(false);
      Alert.alert('Error', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const goBack = () => {
    const from = route.params?.from || 'Welcome';
    navigation.navigate(from);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="chevron-back" size={24} color="blue" onPress={goBack} style={styles.icon} />
      <Text style={styles.headerText}>Login to your account</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email address"
        placeholderTextColor={"gray"}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor={"gray"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Pressable style={styles.button} onPress={handleLogin}>
        {buttonLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </Pressable>
      <Pressable onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </Pressable>
      <View style={styles.signInContainer}>
        
      </View>
      <Pressable style={styles.iconButton} onPress={handleGoogleSignIn}>
        {/* Add Google icon here */}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF',
  },
  icon: {
    marginTop: 40,
    marginBottom: 50,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#034BAD',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#545454',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 18,
    marginBottom: 12,
    color: "#333",
  },
  button: {
    backgroundColor: '#034BAD',
    padding: 12,
    borderRadius: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: '#034BAD',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
    marginBottom: 16,
  },
  line: {
    width: 70,
    height: 1,
    backgroundColor: 'gray',
  },
  signInText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: 'gray',
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 150,
  },
});

export default LoginScreen;