/**
 * Store to hold the message array of the currently loaded chat
 */
import { writable } from 'svelte/store';
import type { Message, MessageStatus } from '$lib/interfaces/objects';

function sortMessages(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;

    return timeA - timeB;
  });
}

function createMessageStore() {
  const { subscribe, set, update } = writable<Message[]>([]);

  return {
    subscribe,

    setMessages: (messages: Message[]) => set(sortMessages(messages)),

    // Push a new message to the screen instantly
    addMessage: (message: Message) =>
      update((messages) => {
        if (messages.find((m) => m.id === message.id)) {
          return messages;
        }
        return [...messages, message];
      }),

    updateMessageAfterSend: (oldId: number, messageId: number, status: MessageStatus) =>
      update((messages) => {
        const message = messages.find((m) => m.id === oldId);
        if (message) {
          message.id = messageId;
          message.status = status;
        }
        return sortMessages(messages);
      }),

    updateMessageStatus: (messageId: number, status: MessageStatus) =>
      update((messages) => {
        const index = messages.findIndex((m) => m.id === messageId);
        if (index !== -1) {
          messages[index].status = status;
        }
        return messages;
      }),

    deleteMessage: (message: Message) =>
      update((messages) => {
        // Returns the array, without the submitted message
        return messages.filter((m) => m.id !== message.id);
      }),

    reset: () => set([])
  };
}

export const messageStore = createMessageStore();
