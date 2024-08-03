import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { auth, db } from "../firebaseConfig"; // Ensure the path is correct to your Firebase config file

const CreateAccountScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false); // Add loading state
  const navigation = useNavigation();
  const route = useRoute();

  const handleCreateAccount = async () => {
    if (!email || !password) {
      Alert.alert("Enter email and password");
    } else {
      setButtonLoading(true); // Start loading
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store user information in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous",
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });

        Alert.alert("Success", "Account created successfully!");
        setButtonLoading(false); // Stop loading
        navigation.navigate("CreateOrganization");
      } catch (error) {
        setButtonLoading(false); // Stop loading
        Alert.alert("Error", error.message);
      }
    }
  };

  const handlePrivacyTerms = () => {
    navigation.navigate("PrivacyTermsScreen");
  };

  const goBack = () => {
    const from = route.params?.from || "Welcome";
    navigation.navigate(from);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="chevron-back" size={24} color="blue" onPress={goBack} style={styles.icon} />
      <Text style={styles.headerText}>Create your new account</Text>
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
      <Text style={styles.textMain}>
        I have read and agree{" "}
        <Text style={styles.textBlue} onPress={handlePrivacyTerms}>
          Privacy Policy, Terms of Service
        </Text>
      </Text>
      <Pressable style={styles.button} onPress={handleCreateAccount}>
        {buttonLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </Pressable>
      
      <Pressable style={styles.iconButton}>
       
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFF",
  },
  icon: {
    marginTop: 40,
    marginBottom: 50,
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#034BAD",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#545454",
    backgroundColor: "#000",
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 18,
    marginBottom: 12,
  },
  textMain: {
    fontSize: 14,
    marginTop: 6,
    marginBottom: 50,
    color: "#000",
  },
  textBlue: {
    color: "#034BAD",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#034BAD",
    padding: 12,
    borderRadius: 50,
    marginBottom: 150,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    justifyContent: "center",
    marginBottom: 16,
  },
  line: {
    width: 70,
    height: 1,
    backgroundColor: "gray",
  },
  signUpText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: "gray",
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 150,
  },
});

export default CreateAccountScreen;
