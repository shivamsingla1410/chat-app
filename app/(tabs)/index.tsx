import { Image, StyleSheet, Platform } from 'react-native';
 
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave'; // Assuming it's a nice wave animation or greeting
import ParallaxScrollView from '@/components/ParallaxScrollView'; // For smooth scrolling and parallax effect
 
export default function ChatRoomWelcomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to the Chat Room!</ThemedText>
        <HelloWave />
      </ThemedView>
 
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Join a Room</ThemedText>
        <ThemedText>
          Select a chat room from the list and start chatting with others.
          If you're new, feel free to explore the public rooms!
        </ThemedText>
      </ThemedView>
 
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Personalize Your Profile</ThemedText>
        <ThemedText>
          Set your username and profile picture to stand out in the chat room.
          Customize your settings and preferences for a better experience.
        </ThemedText>
      </ThemedView>
 
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Start Chatting</ThemedText>
        <ThemedText>
          Once you're in a room, feel free to send messages, share images, and make new friends!
        </ThemedText>
      </ThemedView>
 
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Need Help?</ThemedText>
        <ThemedText>
          Tap the "Help" tab to learn more about how to use the chat room and get assistance if needed.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
 
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  headerImage: {
    height: 200,
    width: '100%',
    resizeMode: 'cover',
  },
});
 