import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const { width, height } = Dimensions.get('window');

const images = [
  require('../assets/Front.png'),
  require('../assets/End.png'),
];

const AboutScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // Change image every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image
        source={images[currentImageIndex]}
        style={styles.image}
        resizeMode="contain"
      />
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="chevron-back" size={24} color="blue" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // You can change this to match your app's theme
  },
  image: {
    width: width,
    height: height,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default AboutScreen;