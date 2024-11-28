import { create } from 'zustand'; // Use main zustand create
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist } from 'zustand/middleware'; // Zustand middleware for persistence

const useChatStore = create(
  persist(
    (set, get) => ({
      chatMessages: [],
      chatParticipants: [],
      newMessage: '',
      chatInfo: null,
      lastUpdateTime: 0,
      sessionUuid: null,
      apiVersion: null,

      setNewMessage: (text) => set({ newMessage: text }),

      fetchInfo: async () => {
        try {
          const response = await fetch('/info'); // Replace with your API endpoint
          if (!response.ok) throw new Error('Failed to fetch chat info');
          const info = await response.json();

          const currentSessionUuid = get().sessionUuid;
          if (currentSessionUuid && currentSessionUuid !== info.sessionUuid) {
            // Clear local data if sessionUuid changes
            set({
              chatMessages: [],
              chatParticipants: [],
              sessionUuid: info.sessionUuid,
              apiVersion: info.apiVersion,
            });
          } else {
            set({ sessionUuid: info.sessionUuid, apiVersion: info.apiVersion });
          }
        } catch (error) {
          console.error('Error fetching chat info:', error);
        }
      },

      fetchAllMessages: async () => {
        try {
          const response = await fetch('/messages/all'); // Replace with your API endpoint
          if (!response.ok) throw new Error('Failed to fetch all messages');
          const messages = await response.json();
          set({ chatMessages: messages });
        } catch (error) {
          console.error('Error fetching all messages:', error);
        }
      },

      fetchLatestMessages: async () => {
        try {
          const response = await fetch('/messages/latest'); // Replace with your API endpoint
          if (!response.ok) throw new Error('Failed to fetch latest messages');
          const latestMessages = await response.json();
          const existingMessages = get().chatMessages;

          const uniqueMessages = [
            ...existingMessages,
            ...latestMessages.filter(
              (msg) => !existingMessages.some((existing) => existing.id === msg.id)
            ),
          ];
          set({ chatMessages: uniqueMessages });
        } catch (error) {
          console.error('Error fetching latest messages:', error);
        }
      },

      fetchOlderMessages: async (refMessageUuid) => {
        try {
          const response = await fetch(`/messages/older/${refMessageUuid}`); // Replace with your API endpoint
          if (!response.ok) throw new Error('Failed to fetch older messages');
          const olderMessages = await response.json();
          set((state) => ({
            chatMessages: [...olderMessages, ...state.chatMessages],
          }));
        } catch (error) {
          console.error('Error fetching older messages:', error);
        }
      },

      fetchMessageUpdates: async () => {
        const lastUpdateTime = get().lastUpdateTime || Date.now();
        try {
          const response = await fetch(`/messages/updates/${lastUpdateTime}`);
          if (!response.ok) throw new Error('Failed to fetch message updates');
          const updatedMessages = await response.json();
          const existingMessages = get().chatMessages;

          const mergedMessages = existingMessages.map((msg) => {
            const updated = updatedMessages.find((uMsg) => uMsg.id === msg.id);
            return updated || msg;
          });

          set({ chatMessages: mergedMessages, lastUpdateTime: Date.now() });
        } catch (error) {
          console.error('Error fetching message updates:', error);
        }
      },

      fetchParticipants: async () => {
        try {
          const response = await fetch('/participants/all'); // Replace with your API endpoint
          if (!response.ok) throw new Error('Failed to fetch participants');
          const participants = await response.json();
          set({ chatParticipants: participants });
        } catch (error) {
          console.error('Error fetching participants:', error);
        }
      },

      fetchParticipantUpdates: async () => {
        const lastUpdateTime = get().lastUpdateTime || Date.now();
        try {
          const response = await fetch(`/participants/updates/${lastUpdateTime}`);
          if (!response.ok) throw new Error('Failed to fetch participant updates');
          const updatedParticipants = await response.json();
          set({
            chatParticipants: updatedParticipants,
            lastUpdateTime: Date.now(),
          });
        } catch (error) {
          console.error('Error fetching participant updates:', error);
        }
      },

      addNewMessage: async () => {
        const newMessage = get().newMessage.trim();
        if (!newMessage) return; // Skip sending if the input is empty

        try {
          const response = await fetch('/messages/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newMessage }),
          });

          if (!response.ok) throw new Error('Failed to send the message');
          const message = await response.json();

          set((state) => ({
            chatMessages: [...state.chatMessages, message],
            newMessage: '',
          }));
        } catch (error) {
          console.error('Error sending new message:', error);
        }
      },
    }),
    {
      name: 'chat-storage',
      getStorage: () => AsyncStorage,
    }
  )
);

export default useChatStore;