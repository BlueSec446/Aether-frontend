/**
 * @file Reactive store for the global list of active conversations.
 * @description Serves as the centralized source of truth for the user's chat threads.
 * By maintaining this state externally from the `ChatBar`, it ensures that background
 * polling or incoming message events can silently update unread statuses, timestamps,
 * and list sorting logic without needing to forcefully re-render the entire component.
 */
import { writable, get } from 'svelte/store';
import type { Chat, Message, MessageStatus } from '$lib/interfaces/objects';
import { DEFAULT_CHAT } from './active_chat_store';

function sortChats(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => {
    const timeA = a.last_message ? new Date(a.last_message.timestamp).getTime() : 0;
    const timeB = b.last_message ? new Date(b.last_message.timestamp).getTime() : 0;

    return timeB - timeA;
  });
}

function createChatStore() {
  const store = writable<Chat[]>([]);
  const { subscribe, set, update } = store;

  return {
    subscribe,

    setChats: (chats: Chat[]) => {
      set(sortChats(chats));
    },

    getOneChat: (chatId: number): Chat => {
      /* Get chat by id, defaults to DEFAULT_CHAT */
      return get(chatStore).find((c) => c.chat_id === chatId) ?? DEFAULT_CHAT;
    },

    sort: () =>
      update((chats) => {
        return sortChats(chats);
      }),

    updateLastMessage: (chatId: number, message: Message) =>
      update((chats) => {
        const chat = chats.find((c) => c.chat_id === chatId);

        if (chat) {
          chat.last_message = message;
        }
        return sortChats(chats);
      }),

    updateLastMessageStatus: (chatId: number, messageId: number, status: MessageStatus) =>
      update((chats) => {
        const chat = chats.find((c) => c.chat_id === chatId);
        if (chat && chat.last_message && chat.last_message.id === messageId) {
          chat.last_message.status = status;
        }
        return sortChats(chats);
      }),

    reset: () => set([])
  };
}

export const chatStore = createChatStore();
