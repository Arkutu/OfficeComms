import React, { useState, useContext, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';


import { UserContext } from '../context/UserContext';
import { useAppContext } from '../context/AppContext';

const { width: screenWidth } = Dimensions.get('window');

const MenuButton = ({ title, onPress, icon: Icon, iconName }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <Icon name={iconName} size={24} color="#000" />
    </View>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const OfficeScreen = ({ route, navigation }) => {
  const { organizationName } = useAppContext();
  const [searchText, setSearchText] = useState('');
  const { user } = useContext(UserContext);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(false);
  const scrollViewRef = useRef(null);

  const getActiveRoute = () => navigation.getState().routes[navigation.getState().index].name;

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleSectionChange = (index) => {
    setActiveSection(index);
    scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
  };

  useEffect(() => {
    let interval;
    if (isAutoSliding) {
      interval = setInterval(() => {
        const nextSection = (activeSection + 1) % sections.length;
        handleSectionChange(nextSection);
      }, 5000); // Change slide every 5 seconds
    }
    return () => clearInterval(interval);
  }, [isAutoSliding, activeSection]);

  const toggleAutoSlide = () => {
    setIsAutoSliding(!isAutoSliding);
  };

  const sections = [
    {
      image: require("../assets/1.png"),
      title: "OfficeComms Attendance",
      subtitle: "Create or join a organization, you will get",
      stats: [
        { text: "Salary calculation efficiency raises", value: "400%" },
        { text: "Company expense reduces", value: "100%" }
      ],
      description: "Check your team status on mobile and generate attendance report in one step"
    },
    {
      image: require("../assets/3.png"),
      title: "OfficeComms Approval",
      subtitle: "Create or join a organization, you will get",
      stats: [
        { text: "Company OA expense reduces", value: "$10,000" },
        { text: "Approval process raises", value: "10X" }
      ],
      description: "Customised templates suit all types of business connecting to Attendance system and Office"
    },
    {
      image: require("../assets/4.png"),
      title: "Unified Communication",
      subtitle: "Create or join a organization, you will get",
      stats: [
        { text: "Company expense reduces", value: "$10,000/yr" },
        { text: "Deployment expense reduces", value: "99%" }
      ],
      description: "Free internet call and conference for internal and external contacts"
    },
    {
      image: require("../assets/5.png"),
      title: "OfficeComms",
      subtitle: "Create or join a organization, you will get",
      stats: [
        { text: "Deployment expense reduces", value: "$10,000" },
        { text: "Daily work saves", value: "60 min/day" }
      ],
      description: "Free with permission management to keep bank level data security. Easy to store enables collaborate easily with external contacts"
    },
    {
      image: require("../assets/2.png"),
      title: "OfficeComms Mail",
      subtitle: "Create or join a organization, you will get",
      stats: [
        { text: "Company expense reduces", value: "$10,000/yr" },
        { text: "Deployment efficiency raises", value: "90%" }
      ],
      description: "Mobile based management, integrated with IM and one step transforming into Office notice"
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            {user && user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
            ) : (
              <Ionicons name="person-circle" size={40} color="#FFF" />
            )}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{organizationName}</Text>
          <TouchableOpacity style={styles.addButton} onPress={toggleMenu}>
            <MaterialCommunityIcons name="view-list" size={26} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Jump to or search..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('CalendarScreen')}>
            <Text style={styles.tabText}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('ToDo')}>
            <Text style={styles.tabText}>To-do</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, styles.activeTabItem]}>
            <Text style={[styles.tabText, styles.activeTabText]}>DING</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Docs')}>
            <Text style={styles.tabText}>Docs</Text>
          </TouchableOpacity>
      
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        onScroll={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const sectionIndex = Math.floor(contentOffsetX / screenWidth);
          setActiveSection(sectionIndex);
        }}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {sections.map((section, index) => (
          <ImageBackground
            key={index}
            source={section.image}
            style={styles.section}
          >
            <View style={styles.sectionContent}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>

              <View style={styles.statsContainer}>
                {section.stats.map((stat, statIndex) => (
                  <View key={statIndex} style={styles.statItem}>
                    <Text style={styles.statText}>{stat.text}</Text>
                    <Text style={styles.statValue}>{stat.value}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionDescription}>{section.description}</Text>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.autoSlideButton}
        onPress={toggleAutoSlide}
      >
        <Text style={styles.autoSlideButtonText}>
          {isAutoSliding ? "Stop Auto Slide" : "Start Auto Slide"}
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('MainHome')}>
          <Ionicons name="home" size={28} color={getActiveRoute() === 'MainHome' ? '#0d6efd' : '#FFF'} />
          <Text style={getActiveRoute() === 'MainHome' ? styles.navTextActive : styles.navTextInactive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('OfficeScreen', { organizationName })}>
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              <Text style={styles.menuTitle}>Menu</Text>
              <View style={styles.menuGrid}>
                <MenuButton title="Chat Bot" icon={FontAwesome6} iconName="robot" onPress={() => navigation.navigate('Chatbot')} />
                <MenuButton title="Clock In/Out" icon={Feather} iconName="clock" onPress={() => navigation.navigate('ClockInOutScreen')} />
                <MenuButton title="Scan QR Code" icon={AntDesign} iconName="qrcode" onPress={() => navigation.navigate('CodeScan')} />
                <MenuButton title="Create/Join organization" icon={SimpleLineIcons} iconName="organization" onPress={() => navigation.navigate('CreateOrganization')} />
                <MenuButton title="Join" icon={MaterialCommunityIcons} iconName="vector-combine" onPress={() => navigation.navigate('JoinMeetingScreen')} />
                <MenuButton title="Start Meeting" icon={MaterialIcons} iconName="meeting-room" onPress={() => navigation.navigate('MeetingScreen')} />
                <MenuButton title="Summarizer" icon={MaterialIcons} iconName="summarize" onPress={() => navigation.navigate('SummaryScreen')} />
                <MenuButton title="Projects" icon={MaterialIcons} iconName="event" onPress={() => navigation.navigate('ProjectListScreen')} />
                <MenuButton title="Create Project" icon={Entypo} iconName="add-to-list" onPress={() => navigation.navigate('ProjectScreen')} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
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
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    color: '#000',
    marginLeft: 10,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  tabItem: {
    marginHorizontal: 15,
  },
  tabText: {
    color: '#FFF',
    fontSize: 16,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#0d6efd',
  },
  activeTabText: {
    color: '#0d6efd',
  },
  section: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContent: {
   
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navTextActive: {
    color: '#0d6efd',
    fontSize: 12,
  },
  navTextInactive: {
    color: '#888',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#000',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  menuText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statText: {
    fontSize: 16,
    color: '#000',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  autoSlideButton: {
    position: 'absolute',
    bottom: 75,
    right: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  autoSlideButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});


export default OfficeScreen;