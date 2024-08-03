import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig';

const Profile = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              email: currentUser.email,
              displayName: userData.displayName || currentUser.displayName,
              gender: userData.gender,
              dateOfBirth: userData.dateOfBirth,
              photoURL: userData.photoURL || currentUser.photoURL,
            });
          } else {
            setUser({
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No user is signed in.");
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ marginTop: 5 }} />

        <View style={styles.profileMe}>
          <View style={styles.profContainer}>
            <Text style={styles.name}>{user?.displayName || "Anonymous"}</Text>

            <View style={{ marginLeft: 10, marginRight: 10, marginTop: 40 }}>
              <View
                style={{
                  width: "100%",
                  height: 2,
                  backgroundColor: "#f1f2f6",
                  alignItems: "center",
                }}
              />
            </View>

            <View style={styles.emailContainer}>
              <Text style={styles.email}>{user?.email || "user@email.com"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.img}>
          <Image
            source={
              user?.photoURL
                ? { uri: user.photoURL }
                : require("../assets/avart.png")
            }
            style={styles.avatar}
          />
        </View>

        <View style={{ marginTop: 60 }} />
        <View style={{ marginBottom: 100 }}>
          <Text style={styles.textHeader}>My Profile</Text>

          <View style={styles.profile}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.settingsContainer}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <View style={styles.items}>
                <Text style={styles.text}>Profile</Text>
              </View>
              <View>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
            </TouchableOpacity>

            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                <Text style={styles.text}>Username</Text>
              </View>

              <View>
                <Text style={styles.itemsText}>
                  {user?.displayName || "Anonymous"}
                </Text>
              </View>
            </View>

            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                <Text style={styles.text}>Email</Text>
              </View>

              <View>
                <Text style={styles.itemsText}>
                  {user?.email || "user@email.com"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }} />
          <Text style={styles.textHeader}>More</Text>

          <View style={styles.profile}>
            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                <Text style={styles.text}>Gender</Text>
              </View>

              <View>
                <Text style={styles.itemsText}>
                  {user?.gender || "male/female"}
                </Text>
              </View>
            </View>

            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                <Text style={styles.text}>Date of Birth</Text>
              </View>

              <View>
                <Text style={styles.itemsText}>
                  {user?.dateOfBirth || "YYYY-MM-DD"}
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }} />
          <Text style={styles.textHeader}>Privacy</Text>

          <View style={styles.profileSeetings}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.settingsContainer}
              onPress={() => navigation.navigate("Settings")}
            >
              <View style={styles.items}>
                <Text style={styles.text}>Settings & Privacy</Text>
              </View>

              <View>
                <Ionicons name="chevron-forward" size={24} color="black" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  profile: {
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
  },
  profileSeetings: {
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 100,
  },
  profileMe: {
    position: "relative",
  },
  profContainer: {
    position: "absolute",
    width: "94%",
    height: 130,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 70,
  },
  img: {
    width: "25%",
    borderColor: "#fff",
    borderRadius: 18,
    marginTop: 35,
    marginLeft: 25,
    backgroundColor: "#fff",
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 18,
  },
  name: {
    color: "#333",
    fontSize: 20,
    fontWeight: "500",
    marginTop: 10,
    marginLeft: 120,
  },
  emailContainer: {
    marginLeft: 18,
    marginTop: 15,
  },
  email: {
    color: "gray",
    fontSize: 14,
  },
  editIcon: {
    marginRight: 5,
  },
  editText: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
  },
  iconHeader: {
    display: "none",
  },
  textHeader: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 20,
  },
  itemsText: {
    color: "#bbb",
    fontSize: 12,
  },
  settingsContainerTop: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: 14,
    marginLeft: 14,
    borderColor: "#ddd",
  },
  settingsContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: 14,
    borderColor: "#ddd",
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  items: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 5,
    marginLeft: 8,
  },
  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#f1f2f6",
    alignItems: "center",
  },
  space: {
    marginLeft: 10,
    marginRight: 10,
  },
});

export default Profile;
