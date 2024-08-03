import React, { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#ccc" },
      headerTitleStyle: { color: "#ccc" },
      headerTintColor: "black",
      headerLeft: () => {
        return (
          <View style={{ marginLeft: 10 }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back-sharp" size={28} color="black" />
            </TouchableOpacity>
          </View>
        );
      },
      headerRight: () => {
        return (
          <View>
            <Text style={styles.textTop}>Settings & Privacy</Text>
          </View>
        );
      },
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Text style={styles.textHeader}>Available</Text>

          <View style={{ marginTop: 20 }} />

          <View style={styles.profile}>
            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                 <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("GeneralScreen")}
            >
                <Text style={styles.text}>General</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.space}>
              <View style={styles.line} />
            </View>

           
          </View>

          <View style={{ marginTop: 20 }} />
          <Text style={styles.textHeader}>Privacy</Text>

          <View style={styles.profile}>
            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                 <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("PermissionsScreen")}
            >
                <Text style={styles.text}>Permission</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            

            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                  <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("NewsScreen")}
            >
                <Text style={styles.text}>News</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 10 }} />
          <Text style={styles.textHeader}>Help</Text>

          <View style={styles.profile}>
            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("HelpAndFeedbackScreen")}
            >
              <Text style={styles.text}>Help and Feedback</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            <View style={styles.settingsContainer}>
              <View style={styles.items}>
                <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate("About")}
            >
                <Text style={styles.text}>About OfficeComms</Text>
             </TouchableOpacity> 
              </View> 
            </View> 
          </View>

          <View style={{ marginTop: 40 }} />
          <View style={styles.profile}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.settingsContainerLogout}
              onPress={() => navigation.navigate("Login")}
            >
              <View style={styles.items}>
                <Text style={styles.text}>Add new account</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.space}>
              <View style={styles.line} />
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.settingsContainerLogout}
              onPress={() => navigation.navigate("SplashScreen")}
            >
              <View style={styles.items}>
                <Text style={styles.text}>Log Out</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 50 }} />
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
  textTop: {
    fontSize: 24,
    fontWeight: "600",
    color: "#555",
    marginRight: 10,
  },
  profile: {
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#fff",
    borderRadius: 6,
    marginLeft: 10,
    marginRight: 10,
  },
  textHeader: {
    color: "#bbb",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 5,
    marginLeft: 20,
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
  settingsContainerLogout: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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

export default Settings;
