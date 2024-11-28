import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

interface Attachment {
  uuid: string;
  type: string;
  url: string;
  width: number;
  height: number;
}

interface Reaction {
  uuid: string;
  participantUuid: string;
  value: string;
}

interface Message {
  uuid: string;
  text: string;
  attachments: Attachment[];
  authorUuid: string;
  reactions: Reaction[];
  sentAt: number;
  updatedAt: number;
}

interface Participant {
  uuid: string;
  name: string;
  avatarUrl: string;
}

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Record<string, Participant>>({});
  const [inputText, setInputText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchMessages = async (page: number) => {
    setLoading(true);
    try {
      // Fetch messages with pagination
      const messagesResponse = await fetch(
       `http://dummy-chat-server.tribechat.pro/api/messages/all?page=${page}`
      );
      const messagesData: Message[] = await messagesResponse.json();

      if (messagesData.length === 0) {
        setHasMore(false); // Stop fetching if no more messages
      } else {
        setMessages((prev) => [...prev, ...messagesData]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoading(false);
  };

  const fetchParticipants = async () => {
    try {
      const participantsResponse = await fetch(
        "http://dummy-chat-server.tribechat.pro/api/participants/all"
      );
      const participantsData: Participant[] = await participantsResponse.json();

      const participantsMap: Record<string, Participant> = participantsData.reduce(
        (acc: any, participant) => {
          acc[participant.uuid] = participant;
          return acc;
        },
        {}
      );

      setParticipants(participantsMap);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  useEffect(() => {
    fetchMessages(1);
    fetchParticipants();
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      uuid: Date.now().toString(),
      text: inputText,
      attachments: [],
      authorUuid: "you",
      reactions: [],
      sentAt: Date.now(),
      updatedAt: Date.now(),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputText("");
  };

  const loadMoreMessages = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchMessages(page + 1);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const author = participants[item.authorUuid];
    const isConsecutive =
      index > 0 && messages[index - 1].authorUuid === item.authorUuid;

    return (
      <View style={styles.messageGroup}>
        {!isConsecutive && author && (
          <View style={styles.messageHeader}>
            <Image source={{ uri: author.avatarUrl }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{author.name}</Text>
              <Text style={styles.timestamp}>
                {new Date(item.sentAt).toLocaleTimeString()}
              </Text>
            </View>
          </View>
        )}
        <View style={[styles.messageContainer, isConsecutive && styles.groupedMessage]}>
          {item.attachments.map((attachment) =>
            attachment.type === "image" ? (
              <Image
                key={attachment.uuid}
                source={{ uri: attachment.url }}
                style={styles.attachmentImage}
              />
            ) : null
          )}
          <Text style={styles.messageText}>
            {item.text}
            {item.updatedAt !== item.sentAt && <Text style={styles.editedText}> (edited)</Text>}
          </Text>
          <View style={styles.reactionsContainer}>
            {item.reactions.map((reaction) => (
              <Text key={reaction.uuid} style={styles.reaction}>
                {reaction.value}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.uuid}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={styles.flatListContent}
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.5}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  flatListContent: { paddingBottom: 20 },
  messageGroup: { marginVertical: 10 },
  messageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  authorName: { fontWeight: "bold", fontSize: 16 },
  timestamp: { fontSize: 12, color: "#888" },
  messageContainer: { padding: 15, backgroundColor: "#f9f9f9", borderRadius: 10, marginLeft: 10 },
  groupedMessage: { marginLeft: 60 },
  messageText: { fontSize: 16 },
  editedText: { fontSize: 12, color: "#888" },
  reactionsContainer: { flexDirection: "row", marginTop: 5 },
  reaction: { marginRight: 5, fontSize: 14, color: "#555" },
  attachmentImage: { width: "100%", height: 200, borderRadius: 10, marginVertical: 10 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatApp;