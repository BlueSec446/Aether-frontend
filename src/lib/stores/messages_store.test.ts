import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { messageStore } from './messages_store';
import type { Message } from '$lib/interfaces/objects';

describe('Messages Store', () => {
  beforeEach(() => {
    messageStore.reset();
  });

  const msg1 = { id: 10, timestamp: '2023-01-01T10:00:00Z', status: 'OUTGOING_CREATED' } as Message;
  const msg2 = {
    id: 11,
    timestamp: '2023-01-01T10:05:00Z',
    status: 'OUTGOING_RECEIVED'
  } as Message;

  it('sorts messages oldest first when setting', () => {
    messageStore.setMessages([msg2, msg1]); // Wrong order
    const store = get(messageStore);
    expect(store[0].id).toBe(10); // Oldest should be at the top of the screen
    expect(store[1].id).toBe(11);
  });

  it('adds a new message', () => {
    messageStore.setMessages([msg1]);
    messageStore.addMessage(msg2);

    const store = get(messageStore);
    expect(store.length).toBe(2);
    expect(store[1].id).toBe(11);
  });

  it('does not duplicate messages if the ID already exists', () => {
    messageStore.setMessages([msg1]);
    messageStore.addMessage(msg1); // Try adding the exact same message

    expect(get(messageStore).length).toBe(1); // Should still only be 1
  });

  it('updates a message ID and status after sending', () => {
    // Simulating the backend returning a real database ID
    const tempMsg = { id: -1, status: 'OUTGOING_CREATED' } as Message;
    messageStore.setMessages([tempMsg]);

    messageStore.updateMessageAfterSend(-1, 99, 'OUTGOING_RECEIVED');

    const store = get(messageStore);
    expect(store[0].id).toBe(99);
    expect(store[0].status).toBe('OUTGOING_RECEIVED');
  });

  it('deletes a message', () => {
    messageStore.setMessages([msg1, msg2]);
    messageStore.deleteMessage(msg1);

    const store = get(messageStore);
    expect(store.length).toBe(1);
    expect(store[0].id).toBe(11);
  });
});
