import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OrganizationProvider } from './context/OrganizationContext';
import { ProjectProvider } from './context/ProjectContext';
import { LoadingProvider } from './context/LoadingContext';
import { UserProvider } from './context/UserContext';
import { AppProvider } from './context/AppContext';
import { handleInvitationLink } from './invitationUtils';
import Welcome from './Screens/Welcome';
import LoginScreen from './Screens/LoginScreen';
import CreateAccountScreen from './Screens/CreateAccountScreen';
import CreateOrganization from './Screens/CreateOrganization';
import OrganizationScreen from './Screens/OrganizationScreen';
import ExistingOrganizations from './Screens/ExistingOrganizations';
import InviteLinkScreen from './Screens/InviteLinkScreen';  
import MainHomeScreen from './Screens/MainHomeScreen';
import OfficeScreen from './Screens/OfficeScreen';
import SplashScreen from './Screens/SplashScreen';
import ChatScreen from './Screens/ChatScreen';
import ChannelBrowser from './Screens/ChannelBrowser';
import CreateChannel from './Screens/CreateChannel';
import ChannelVisibility from './Screens/ChannelVisibility';
import ChannelDetails from './Screens/ChannelDetails';
import CreateChannelScreen from './Screens/CreateChannelScreen';
import MembersScreen from './Screens/MembersScreen';
import VideoCall from './Screens/VideoCall';
import MeetingScreen from './Screens/MeetingScreen';
import JoinMeetingScreen from './Screens/JoinMeetingScreen';
import ClockInOutScreen from './Screens/ClockInOutScreen';
import LeaveRequestScreen from './Screens/LeaveRequestScreen';
import ProjectScreen from './Screens/ProjectScreen';
import ProjectListScreen from './Screens/ProjectListScreen';
import CalendarScreen from './Screens/CalendarScreen';
import QRCodeScanner from './Screens/QrCodeScannerScreen';
import ChatbotScreen from './Screens/ChatbotScreen';
import ActivityScreen from './Screens/ActivityScreen';
import Profile from './Screens/Profile';
import EditProfile from './Screens/EditProfile';
import TodoListScreen from './Screens/TodoListScreen';
import SettingsScreen from './Screens/SettingsScreen';
import ToDoScreen from './Screens/ToDoScreen';
import { enableScreens } from 'react-native-screens';
import QrCodeScannerScreen from './Screens/QrCodeScannerScreen';
import DocumentUploadScreen from './Screens/DocumentUploadScreen';
import SummaryScreen from './Screens/SummaryScreen';
import AboutScreen from './Screens/AboutScreen';
import HelpAndFeedbackScreen from './Screens/HelpAndFeedbackScreen';
import GeneralScreen from './Screens/GeneralScreen';
import PermissionsScreen from './Screens/PermissionsScreen';
import NewsScreen from './Screens/NewsScreen';

enableScreens(true);

const Stack = createStackNavigator();

const screens = [
  { name: 'Welcome', component: Welcome },
  { name: 'Login', component: LoginScreen },
  { name: 'CreateNewAccount', component: CreateAccountScreen },
  { name: 'CreateOrganization', component: CreateOrganization },
  { name: 'OrganizationScreen', component: OrganizationScreen },
  { name: 'ExistingOrganizations', component: ExistingOrganizations },
  { name: 'InviteLinkScreen', component: InviteLinkScreen },
  { name: 'MainHome', component: MainHomeScreen },
  { name: 'OfficeScreen', component: OfficeScreen },
  { name: 'SplashScreen', component: SplashScreen},
  { name: 'Chat', component: ChatScreen },
  { name: 'ChannelBrowser', component: ChannelBrowser },
  { name: 'CreateChannel', component: CreateChannel },
  { name: 'ChannelVisibility', component: ChannelVisibility },
  { name: 'ChannelDetails', component: ChannelDetails },
  { name: 'CreateChannelScreen', component: CreateChannelScreen },
  { name: 'MembersScreen', component: MembersScreen },
  { name: 'VideoCall', component: VideoCall },
  { name: 'MeetingScreen', component: MeetingScreen},
  { name: 'JoinMeetingScreen', component: JoinMeetingScreen},
  { name: 'ClockInOutScreen', component: ClockInOutScreen},
  { name: 'LeaveRequestScreen', component: LeaveRequestScreen },
  { name: 'ProjectScreen', component: ProjectScreen },
  { name: 'ProjectListScreen', component: ProjectListScreen },
  { name: 'CalendarScreen', component: CalendarScreen },
  { name: 'CodeScan', component: QrCodeScannerScreen },
  { name: 'Chatbot', component:ChatbotScreen},
  { name: 'Activity', component:ActivityScreen},
  { name: 'Profile', component: Profile },
  { name: 'EditProfile', component: EditProfile },
  { name: 'TodoListScreen', component: TodoListScreen },
  { name: 'Settings', component: SettingsScreen },
  { name: 'ToDo', component: ToDoScreen },
  { name: 'Docs', component: DocumentUploadScreen },
  { name: 'SummaryScreen', component: SummaryScreen },
  { name: 'About', component: AboutScreen},
  { name: 'HelpAndFeedbackScreen', component: HelpAndFeedbackScreen},
  { name: 'GeneralScreen', component: GeneralScreen},
  { name: 'PermissionsScreen', component: PermissionsScreen},
  { name: 'NewsScreen', component: NewsScreen},

];

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialRoute, setInitialRoute] = useState('SplashScreen');

  const linking = {
    prefixes: ['officecomms://'],
    config: {
      screens: {
        JoinOrganization: {
          path: 'join/:linkId',
          parse: {
            linkId: (linkId) => `${linkId}`,
          },
        },
      },
    },
  };

  const handleDeepLink = async (event) => {
    const { path, queryParams } = Linking.parse(event.url);
    if (path && path.includes('join')) {
      const linkId = queryParams.linkId;
      const userId = 'currentUserId';
      try {
        await handleInvitationLink(linkId, userId);
        console.log('User successfully joined the organization');
      } catch (error) {
        console.error('Failed to join organization:', error);
      }
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const value = await AsyncStorage.getItem('userLoggedIn');
        if (value === 'true') {
          setIsLoggedIn(true);
          setInitialRoute('MainHome');
        } else {
          setInitialRoute('Welcome');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setInitialRoute('Welcome');
      }
    };

    checkLoginStatus();

    const subscription = Linking.addEventListener('url', handleDeepLink);
    console.log('Linking subscription added', subscription);

    return () => {
      if (subscription && subscription.remove) {
        subscription.remove();
        console.log('Linking subscription removed');
      } else {
        console.error('Linking subscription removal failed', subscription);
      }
    };
  }, []);

  return (
    <AppProvider>
      <UserProvider>
        <OrganizationProvider>
          <ProjectProvider>
            <LoadingProvider>
              <NavigationContainer linking={linking}>
                <Stack.Navigator initialRouteName={initialRoute}>
                  {screens.map((screen, index) => (
                    <Stack.Screen
                      key={index}
                      name={screen.name}
                      component={screen.component}
                      options={
                        screen.name === 'MainHome'
                          ? {
                              headerShown: false,
                              gestureEnabled: false,
                            }
                          : { headerShown: false }
                      }
                    />
                  ))}
                </Stack.Navigator>
              </NavigationContainer>
            </LoadingProvider>
          </ProjectProvider>
        </OrganizationProvider>
      </UserProvider>
    </AppProvider>
  );
};

export default App;
