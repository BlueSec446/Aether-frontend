import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { onAddChat } from './chat_bar';
import { activeChat, DEFAULT_CHAT } from '$lib/stores/active_chat_store';
import { chatStore } from '$lib/stores/chat_store';
import { loadChats } from '../../routes/chats/chats';
import type { Chat } from '$lib/interfaces/objects';

vi.mock('../../routes/chats/chats', () => ({
    loadChats: vi.fn()
}));

describe('Chat Bar - onAddChat', () => {
    let alertMock: ReturnType<typeof vi.spyOn>;
    let consoleWarnMock: ReturnType<typeof vi.spyOn>;
    let consoleErrorMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        // Inject global frontendAPI mock into the window object
        (window as any).frontendAPI = {
            newContact: vi.fn()
        };

        alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
        consoleWarnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});
        consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});

        activeChat.set(DEFAULT_CHAT);
        chatStore.reset(); 
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('successfully adds a contact and sets the active chat', async () => {
        (window.frontendAPI.newContact as any).mockResolvedValue({ id: 99 });
        
        const mockChat: Chat = {
            chat_id: 10,
            is_group: 0,
            contact_ids: [{ contact_id: 99 }],
            title: 'Test User',
            display_name: 'Test User',
            last_message: null
        };
        
        // Simulate loadChats populating the store with the newly created chat
        vi.mocked(loadChats).mockImplementation(async () => {
            chatStore.setChats([mockChat]);
        });

        await onAddChat('Test User', 'onion123');

        expect(window.frontendAPI.newContact).toHaveBeenCalledWith('onion123', 'Test User');
        expect(loadChats).toHaveBeenCalled();
        expect(get(activeChat)).toEqual(mockChat);
    });

    it('logs a warning if the new chat is not found in the chatStore', async () => {
        (window.frontendAPI.newContact as any).mockResolvedValue({ id: 99 });
        
        // Simulate loadChats completing but returning an empty store
        vi.mocked(loadChats).mockImplementation(async () => {
            chatStore.setChats([]); 
        });

        await onAddChat('Ghost User', 'onion404');

        expect(consoleWarnMock).toHaveBeenCalledWith('Neuer Chat wurde nicht in der Chat-Liste gefunden.');
        expect(get(activeChat)).toEqual(DEFAULT_CHAT);
    });

    it('catches errors, logs them, and shows an alert to the user', async () => {
        const mockError = new Error('Tor Network Offline');
        (window.frontendAPI.newContact as any).mockRejectedValue(mockError);

        await onAddChat('Error User', 'onion500');

        expect(consoleErrorMock).toHaveBeenCalledWith('Fehler beim Hinzufügen des Kontakts:', mockError);
        expect(alertMock).toHaveBeenCalledWith('Kontakt konnte nicht hinzugefügt werden.');
        expect(loadChats).not.toHaveBeenCalled(); 
    });
});