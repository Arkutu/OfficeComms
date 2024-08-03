import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Section = ({ title, content }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

const GeneralScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>The Essentials of Office Communication</Text>

      <Text style={styles.paragraph}>
        Effective communication is the cornerstone of any successful office environment. With the advent of technology, real-time communication tools such as texting, video calls, and voice calls have become integral to our daily work routines.
      </Text>

      <Section 
        title="Real-Time Texting"
        content="• Instant Messaging (IM)\n• Group Chats\n• Status Indicators\n• Message Threads\n• File Sharing\n• Emojis and Reactions"
      />

      <Section 
        title="Video Calls"
        content="• High-Definition Video\n• Screen Sharing\n• Virtual Backgrounds\n• Meeting Recording\n• Breakout Rooms\n• Chat Function"
      />

      <Section 
        title="Voice Calls"
        content="• Call Quality\n• Voicemail\n• Conference Calls\n• Call Transfer and Forwarding\n• Call Recording"
      />

      <Text style={styles.subTitle}>Dos and Don'ts of Using the App</Text>

      <View style={styles.dosAndDonts}>
        <View style={styles.doColumn}>
          <Text style={styles.columnTitle}>Do</Text>
          <Text style={styles.listItem}>• Be Prompt</Text>
          <Text style={styles.listItem}>• Be Clear and Concise</Text>
          <Text style={styles.listItem}>• Use Proper Language</Text>
          <Text style={styles.listItem}>• Respect Privacy</Text>
          <Text style={styles.listItem}>• Participate Actively</Text>
          <Text style={styles.listItem}>• Provide Constructive Feedback</Text>
          <Text style={styles.listItem}>• Follow Meeting Etiquette</Text>
          <Text style={styles.listItem}>• Use Emojis Appropriately</Text>
          <Text style={styles.listItem}>• Secure Your Communication</Text>
          <Text style={styles.listItem}>• Stay Organized</Text>
        </View>
        <View style={styles.dontColumn}>
          <Text style={styles.columnTitle}>Don't</Text>
          <Text style={styles.listItem}>• Avoid Over-Messaging</Text>
          <Text style={styles.listItem}>• Don't Ignore Messages</Text>
          <Text style={styles.listItem}>• Avoid Using All Caps</Text>
          <Text style={styles.listItem}>• Don't Share Sensitive Information</Text>
          <Text style={styles.listItem}>• Avoid Interrupting</Text>
          <Text style={styles.listItem}>• Don't Be Negative</Text>
          <Text style={styles.listItem}>• Don't Use Inappropriate Emojis</Text>
          <Text style={styles.listItem}>• Don't Forget to Log Out</Text>
          <Text style={styles.listItem}>• Avoid Multitasking</Text>
          <Text style={styles.listItem}>• Don't Neglect Follow-Ups</Text>
        </View>
      </View>

      <Section 
        title="Integrating Communication Tools in Your Workflow"
        content="1. Choose the Right Tools\n2. Train Your Team\n3. Set Guidelines\n4. Encourage Regular Check-Ins\n5. Leverage Integrations\n6. Monitor Usage\n7. Solicit Feedback"
      />

      <Text style={styles.paragraph}>
        Effective communication is vital for the success of any organization. Real-time texting, video calls, and voice calls are powerful tools that can enhance collaboration, streamline workflows, and foster a positive work environment. By understanding the features of these tools and adhering to the dos and don'ts, you can ensure that your office communication is efficient, respectful, and productive.
      </Text>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
    color: '#333',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#444',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  sectionContent: {
    fontSize: 14,
    color: '#34495e',
  },
  dosAndDonts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  doColumn: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    padding: 10,
    marginRight: 5,
  },
  dontColumn: {
    flex: 1,
    backgroundColor: '#ffebee',
    borderRadius: 10,
    padding: 10,
    marginLeft: 5,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2c3e50',
  },
  listItem: {
    fontSize: 12,
    marginBottom: 3,
    color: '#34495e',
  },
  backButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GeneralScreen;