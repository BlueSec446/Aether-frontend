import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { chatStore } from './chat_store';
import { DEFAULT_CHAT } from './active_chat_store';
import type { Chat, Message } from '$lib/interfaces/objects';

describe('Chat Store', () => {
  beforeEach(() => {
    chatStore.reset();
  });

  const mockOldChat: Chat = {
    chat_id: 1,
    title: 'Old',
    is_group: 0,
    display_name: '',
    contact_ids: [{ contact_id: 1 }],
    last_message: { id: 1, timestamp: '2023-01-01T10:00:00Z' } as Message
  };

  const mockNewChat: Chat = {
    chat_id: 2,
    title: 'New',
    is_group: 0,
    display_name: '',
    contact_ids: [{ contact_id: 2 }],
    last_message: { id: 2, timestamp: '2023-01-02T10:00:00Z' } as Message
  };

  it('initializes as an empty array', () => {
    expect(get(chatStore)).toEqual([]);
  });

  it('sorts chats by newest last_message automatically when setting chats', () => {
    // Pass them in the wrong order
    chatStore.setChats([mockOldChat, mockNewChat]);

    const store = get(chatStore);
    expect(store[0].chat_id).toBe(2); // Newest should be first
    expect(store[1].chat_id).toBe(1);
  });

  it('returns a specific chat by ID', () => {
    chatStore.setChats([mockOldChat, mockNewChat]);
    const found = chatStore.getOneChat(1);
    expect(found.title).toBe('Old');
  });

  it('returns DEFAULT_CHAT if the ID is not found', () => {
    chatStore.setChats([mockOldChat]);
    const notFound = chatStore.getOneChat(999);
    expect(notFound).toEqual(DEFAULT_CHAT);
  });

  it('updates a last message and resorts the array', () => {
    chatStore.setChats([mockOldChat, mockNewChat]); // ID 2 is currently first

    const brandNewMessage = { id: 3, timestamp: '2023-01-05T10:00:00Z' } as Message;
    chatStore.updateLastMessage(1, brandNewMessage); // Update the older chat

    const store = get(chatStore);
    expect(store[0].chat_id).toBe(1); // ID 1 should now jump to the top!
    expect(store[0].last_message?.id).toBe(3);
  });
});
