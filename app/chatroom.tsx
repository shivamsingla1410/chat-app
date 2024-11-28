import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import useChatStore from '../components/store';

export default function ChatRoomScreen() {
  const {
    chatMessages,
    newMessage,
    chatInfo,
    setNewMessage,
    addNewMessage,
    fetchInfo,
    fetchAllMessages,
    fetchLatestMessages,
    fetchMessageUpdates,
    fetchParticipants,
  } = useChatStore();

  useEffect(() => {
    fetchInfo();
    fetchAllMessages();
    fetchParticipants();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessageUpdates();
    }, 5000); // Polling every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/userlist')}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubble" size={40} color="white" style={styles.icon} />
          <Text style={styles.userName}>{chatInfo?.title || 'Chat Room'}</Text>
        </View>
      </View>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              { flexDirection: item.senderId === '1' ? 'row-reverse' : 'row' },
            ]}
          >
            <Ionicons
              name="person"
              size={24}
              color={item.senderId === '1' ? '#0078F7' : '#333'}
              style={styles.messageIcon}
            />
            <View
              style={[
                styles.messageBubble,
                {
                  backgroundColor:
                    item.senderId === '1' ? '#0078F7' : '#f0f0f0',
                },
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: item.senderId === '1' ? 'white' : 'black' },
                ]}
              >
                {item.text}
              </Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity onPress={addNewMessage}>
          <Text style={styles.sendButton}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0078F7',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  backButton: {
    fontSize: 28,
    color: 'white',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  icon: {
    marginHorizontal: 10,
  },
  userInfo: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  messagesList: {
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  messageIcon: {
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'center',
    marginTop: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0078F7',
  },
});