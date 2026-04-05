import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { loadChats, sync, processSyncData, getSystemStatus } from './chats_wrapper';
import { chatStore } from '$lib/stores/chat_store';
import { activeChat, DEFAULT_CHAT } from '$lib/stores/active_chat_store';
import { messageStore } from '$lib/stores/messages_store';
import type { Chat, Message } from '$lib/interfaces/objects';
import type { SyncResponse } from '$lib/interfaces/response_objects';

describe('Chats Controller', () => {
  let consoleErrorMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Inject context bridge facade
    (window as any).frontendAPI = {
      getChats: vi.fn(),
      sync: vi.fn(),
      systemStatus: vi.fn()
    };

    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Reset all stores to a clean slate
    chatStore.reset();
    activeChat.set(DEFAULT_CHAT);
    messageStore.reset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.useRealTimers(); // Release the frozen time
  });

  describe('loadChats', () => {
    const mockChats: Chat[] = [
      {
        chat_id: 1,
        title: 'Alice',
        is_group: 0,
        display_name: 'Alice',
        contact_ids: [{ contact_id: 1 }],
        last_message: null
      },
      {
        chat_id: 2,
        title: 'Bob',
        is_group: 0,
        display_name: 'Bob',
        contact_ids: [{ contact_id: 1 }],
        last_message: null
      }
    ];

    it('fetches chats and populates the chatStore', async () => {
      (window.frontendAPI.getChats as any).mockResolvedValue(mockChats);

      await loadChats();

      expect(window.frontendAPI.getChats).toHaveBeenCalled();
      expect(get(chatStore).length).toBe(2);
    });

    it('refreshes the activeChat state if a chat is currently open', async () => {
      (window.frontendAPI.getChats as any).mockResolvedValue(mockChats);

      activeChat.set({ ...DEFAULT_CHAT, chat_id: 1, title: 'Old Title' });

      await loadChats();

      expect(get(activeChat).title).toBe('Alice');
    });

    it('handles network errors gracefully', async () => {
      (window.frontendAPI.getChats as any).mockRejectedValue(new Error('Network offline'));

      await loadChats();

      expect(consoleErrorMock).toHaveBeenCalled();
      expect(get(chatStore)).toEqual([]); // Store remains untouched
    });
  });

  describe('sync', () => {
    it('processes sync data and returns a new ISO timestamp', async () => {
      // Freeze time to specific moment to assert exact return value
      vi.useFakeTimers();
      const freezeTime = new Date('2026-01-01T12:00:00Z');
      vi.setSystemTime(freezeTime);

      const mockSyncResponse: SyncResponse = { new_messages: [], status_updates: [] };
      (window.frontendAPI.sync as any).mockResolvedValue(mockSyncResponse);

      const newTimestamp = await sync('2025-12-31T12:00:00Z');

      expect(window.frontendAPI.sync).toHaveBeenCalledWith('2025-12-31T12:00:00Z');
      expect(newTimestamp).toBe(freezeTime.toISOString());
    });

    it('returns the old timestamp if the sync fails, preventing data gaps', async () => {
      (window.frontendAPI.sync as any).mockRejectedValue(new Error('API failure'));

      const returnedTimestamp = await sync('2025-12-31T12:00:00Z');

      expect(consoleErrorMock).toHaveBeenCalled();
      expect(returnedTimestamp).toBe('2025-12-31T12:00:00Z'); // Rolled back to previous timestamp
    });
  });

  describe('processSyncData', () => {
    const incomingMsg = {
      id: 100,
      chat_id: 1,
      content: 'Hello',
      status: 'INCOMING_UNREAD'
    } as Message;
    const statusUpdate = { chat_id: 2, message_id: 50, status: 'OUTGOING_RECEIVED' };

    it('updates chatStore when new messages arrive for an inactive chat', () => {
      chatStore.setChats([
        {
          chat_id: 1,
          is_group: 0,
          display_name: '',
          title: '',
          contact_ids: [{ contact_id: 1 }],
          last_message: null
        }
      ]);

      processSyncData({ new_messages: [incomingMsg], status_updates: [] });

      // Chat store should receive the last message, but message store remains empty
      expect(get(chatStore)[0].last_message?.id).toBe(100);
      expect(get(messageStore)).toEqual([]);
    });

    it('pushes messages directly to the screen and marks read if the chat is active', () => {
      chatStore.setChats([
        {
          chat_id: 1,
          is_group: 0,
          display_name: '',
          title: '',
          contact_ids: [{ contact_id: 1 }],
          last_message: null
        }
      ]);
      activeChat.set({ ...DEFAULT_CHAT, chat_id: 1 });

      processSyncData({ new_messages: [{ ...incomingMsg }], status_updates: [] });

      const messages = get(messageStore);
      expect(messages.length).toBe(1);
      expect(messages[0].id).toBe(100);
      expect(messages[0].status).toBe('INCOMING_READ'); // Automatically marked as read
    });

    it('applies status updates (e.g. read receipts) to the active chat screen', () => {
      activeChat.set({ ...DEFAULT_CHAT, chat_id: 2 });
      messageStore.setMessages([{ id: 50, status: 'OUTGOING_CREATED' } as Message]);

      processSyncData({ new_messages: [], status_updates: [statusUpdate as any] });

      expect(get(messageStore)[0].status).toBe('OUTGOING_RECEIVED');
    });
  });

  describe('getSystemStatus', () => {
    it('returns system status data successfully', async () => {
      const mockStatus = { tor_bootstrap: 100, network_health: 'good' };
      (window.frontendAPI.systemStatus as any).mockResolvedValue(mockStatus);

      const result = await getSystemStatus();

      expect(result).toEqual(mockStatus);
      expect(window.frontendAPI.systemStatus).toHaveBeenCalled();
    });

    it('returns null and logs gracefully on failure', async () => {
      (window.frontendAPI.systemStatus as any).mockRejectedValue(new Error('Daemon offline'));

      const result = await getSystemStatus();

      expect(consoleErrorMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
