import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AuthScreen({ navigation }) {  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setIsLoading(false);
      navigation.replace('MainTabs');
    }, 1000);
  };

  return (
    <LinearGradient
      colors={['#FFE5E5', '#FFF5F5', '#FFFFFF']}
      style={styles.container}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="cherry-blossom" size={40} color="#FF9999" />
        <Text style={styles.title}>さくらソーシャル</Text>
        <Text style={styles.subtitle}>あなたの思い出を共有しよう</Text>
      </View>

      <Image
        source={{ uri: 'https://api.a0.dev/assets/image?text=anime girl with cherry blossoms and traditional japanese elements&aspect=1:1' }}
        style={styles.heroImage}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.googleButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <MaterialCommunityIcons name="google" size={24} color="#FF6B6B" />
          <Text style={styles.googleButtonText}>Googleでログイン</Text>
        </Pressable>

        <Text style={styles.terms}>
          ログインすることで、
          <Text style={styles.link}>利用規約</Text>
          と
          <Text style={styles.link}>プライバシーポリシー</Text>
          に同意したことになります。
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  heroImage: {
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: 20,
    marginVertical: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 25,
    width: '90%',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  terms: {
    marginTop: 20,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  link: {
    color: '#FF9999',
    textDecorationLine: 'underline',
  },
});