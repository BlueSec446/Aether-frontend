import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { 
    loadChat, postMessage, removeMessage, clearChat, 
    updateAlias, deleteContact, exportContent 
} from './chat_window';

import { messageStore } from '$lib/stores/messages_store';
import { activeChat, DEFAULT_CHAT } from '$lib/stores/active_chat_store';
import { chatStore } from '$lib/stores/chat_store';
import { loadChats } from '../../routes/chats/chats';
import type { Message, Chat } from '$lib/interfaces/objects';

// Mock the external loadChats function
vi.mock('../../routes/chats/chats', () => ({
    loadChats: vi.fn()
}));

describe('Chat Window Controller', () => {
    let consoleErrorMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // Setup the global window API mock
        (window as any).frontendAPI = {
            getMessages: vi.fn(),
            sendMessage: vi.fn(),
            deleteMessage: vi.fn(),
            deleteMessages: vi.fn(),
            updateContactAlias: vi.fn(),
            deleteContact: vi.fn(),
            export: vi.fn()
        };

        // Suppress console.errors in the test output so it stays clean
        consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

        // Reset stores to their clean states
        activeChat.set(DEFAULT_CHAT);
        messageStore.reset();
        chatStore.reset();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('loadChat', () => {
        it('aborts early if no chat is selected (chat_id === -1)', async () => {
            await loadChat();
            expect(window.frontendAPI.getMessages).not.toHaveBeenCalled();
        });

        it('loads messages, updates unread status, and updates chatStore', async () => {
            const mockChat = { ...DEFAULT_CHAT, chat_id: 1 } as Chat;
            activeChat.set(mockChat);

            const mockMessages = [
                { id: 10, status: "INCOMING_READ" } as Message,
                { id: 11, status: "INCOMING_UNREAD" } as Message // Last message
            ];
            
            (window.frontendAPI.getMessages as any).mockResolvedValue(mockMessages);
            
            // Spy on store methods to ensure they get called
            const updateStatusSpy = vi.spyOn(messageStore, 'updateMessageStatus');
            const updateChatLastMsgSpy = vi.spyOn(chatStore, 'updateLastMessage');

            await loadChat();

            expect(window.frontendAPI.getMessages).toHaveBeenCalledWith(1);
            
            // It should have caught the INCOMING_UNREAD status and flipped it
            expect(updateStatusSpy).toHaveBeenCalledWith(11, "INCOMING_READ");
            expect(updateChatLastMsgSpy).toHaveBeenCalledWith(1, expect.objectContaining({ id: 11, status: "INCOMING_READ" }));
        });
    });

    describe('postMessage', () => {
        it('prevents ID clashes, adds message optimistically, and updates after send', async () => {
            activeChat.set({ ...DEFAULT_CHAT, chat_id: 2 } as Chat);
            
            // Pre-load a message with ID -1 to force a clash
            messageStore.setMessages([{ id: -1, content: "Old message" } as Message]);
            
            const newMsg = { id: -1, content: "Hello" } as Message;
            
            (window.frontendAPI.sendMessage as any).mockResolvedValue({ 
                message_id: 99, 
                status: "OUTGOING_SENT" 
            });

            await postMessage(newMsg);

            // It should have subtracted 1 to avoid the clash
            const storeState = get(messageStore);
            expect(storeState.find(m => m.content === "Hello")?.id).toBe(99); // Was updated via updateMessageAfterSend
            expect(window.frontendAPI.sendMessage).toHaveBeenCalledWith(2, "Hello");
        });
    });

    describe('removeMessage', () => {
        const mockMsg = { id: 5, content: "Delete me" } as Message;

        it('removes message optimistically and calls API', async () => {
            messageStore.setMessages([mockMsg]);
            (window.frontendAPI.deleteMessage as any).mockResolvedValue({ status: "success" });

            await removeMessage(mockMsg);

            expect(get(messageStore)).toEqual([]); // Successfully removed
            expect(window.frontendAPI.deleteMessage).toHaveBeenCalledWith(5);
        });

        it('rolls back the message if the backend fails', async () => {
            messageStore.setMessages([mockMsg]);
            // Simulate an API failure
            (window.frontendAPI.deleteMessage as any).mockRejectedValue(new Error("API Down"));

            await removeMessage(mockMsg);

            // It should have restored the message to the store!
            expect(get(messageStore)).toContainEqual(mockMsg);
            expect(consoleErrorMock).toHaveBeenCalled();
        });
    });

    describe('clearChat', () => {
        it('clears messages optimistically and calls API', async () => {
            activeChat.set({ ...DEFAULT_CHAT, chat_id: 3 } as Chat);
            messageStore.setMessages([{ id: 1 } as Message]);
            
            (window.frontendAPI.deleteMessages as any).mockResolvedValue({ status: "success" });

            await clearChat();

            expect(get(messageStore)).toEqual([]);
            expect(window.frontendAPI.deleteMessages).toHaveBeenCalledWith(3);
        });

        it('rolls back if the backend fails to clear', async () => {
            activeChat.set({ ...DEFAULT_CHAT, chat_id: 3 } as Chat);
            const backupMsg = { id: 1, content: "Backup" } as Message;
            messageStore.setMessages([backupMsg]);
            
            (window.frontendAPI.deleteMessages as any).mockResolvedValue({ status: "error" });

            await clearChat();

            expect(get(messageStore)).toEqual([backupMsg]); // Rolled back
        });
    });

    describe('updateAlias', () => {
        it('updates alias optimistically, calls API, and reloads chats', async () => {
            activeChat.set({ ...DEFAULT_CHAT, chat_id: 1, title: "Old Name" } as Chat);
            (window.frontendAPI.updateContactAlias as any).mockResolvedValue({});

            await updateAlias(42, "New Name");

            expect(get(activeChat).title).toBe("New Name");
            expect(window.frontendAPI.updateContactAlias).toHaveBeenCalledWith(42, "New Name");
            expect(loadChats).toHaveBeenCalled();
        });

        it('rolls back the alias if the backend fails', async () => {
            activeChat.set({ ...DEFAULT_CHAT, chat_id: 1, title: "Old Name" } as Chat);
            (window.frontendAPI.updateContactAlias as any).mockRejectedValue(new Error("Network Error"));

            await updateAlias(42, "New Name");

            expect(get(activeChat).title).toBe("Old Name"); // Rolled back!
        });
    });

    describe('deleteContact', () => {
        it('calls clearChat if the chat is a group', async () => {
            activeChat.set({ ...DEFAULT_CHAT, chat_id: 5, is_group: 1 } as Chat);
            (window.frontendAPI.deleteMessages as any).mockResolvedValue({ status: "success" });

            await deleteContact();

            expect(window.frontendAPI.deleteMessages).toHaveBeenCalledWith(5); // clearChat delegates here
        });

        it('deletes a normal contact, resets active chat, and reloads chats', async () => {
            activeChat.set({ 
                ...DEFAULT_CHAT, 
                chat_id: 5, 
                is_group: 0,
                contact_ids: [{ contact_id: 99 }] 
            } as Chat);

            (window.frontendAPI.deleteContact as any).mockResolvedValue({ status: "success" });

            await deleteContact();

            expect(window.frontendAPI.deleteContact).toHaveBeenCalledWith(99);
            expect(get(activeChat)).toEqual(DEFAULT_CHAT); // Closes the chat window
            expect(loadChats).toHaveBeenCalled(); // Updates the sidebar
        });
    });

    describe('exportContent', () => {
        it('returns the file path on success', async () => {
            (window.frontendAPI.export as any).mockResolvedValue({ 
                status: "success", 
                file_path: "/downloads/backup.zip" 
            });

            const result = await exportContent("password123", true);

            expect(result).toBe("/downloads/backup.zip");
            expect(window.frontendAPI.export).toHaveBeenCalledWith("password123", true);
        });

        it('returns null and logs error on failure', async () => {
            (window.frontendAPI.export as any).mockResolvedValue({ status: "error", message: "Bad Password" });

            const result = await exportContent("wrongpassword", true);

            expect(result).toBeNull();
            expect(consoleErrorMock).toHaveBeenCalled();
        });
    });
});