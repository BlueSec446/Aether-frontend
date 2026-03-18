/**
 * Store to hold the message array of the currently loaded chat
 */
import { writable } from 'svelte/store';
import type { Message, MessageStatus } from '$lib/interfaces/objects';

function createMessageStore() {
    const { subscribe, set, update } = writable<Message[]>([]);

    return {
        subscribe,
        
        setMessages: (messages: Message[]) => set(messages),
        
        // Push a new message to the screen instantly
        addMessage: (message: Message) => update(messages => {
            return [...messages, message];
        }),

        updateMessageAfterSend: (messageId: number, status: MessageStatus) => update(messages => {
            messages[-1].id = messageId;
            messages[-1].status = status;
            return messages;
        }),

        updateMessageStatus: (messageId: number, status: MessageStatus) => update(messages => {
            const index = messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                messages[index].status = status;
            }
            return messages;
        }),

        deleteMessage: (message: Message) => update(messages => {
            // Returns the array, without the submitted message
            return messages.filter(m => m.id !== message.id)
        }),

        reset: () => set([])
    };
}

export const messageStore = createMessageStore();