import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import { get } from 'svelte/store';
import ChatBar from './ChatBar.svelte';

import { activeChat, DEFAULT_CHAT } from '$lib/stores/active_chat_store';
import { chatStore } from '$lib/stores/chat_store';
import { userStore } from '$lib/stores/user_store';
import { onAddChat } from './chat_bar';
import type { Chat } from '$lib/interfaces/objects';

// Intercept the controller logic
vi.mock('./chat_bar', () => ({
    onAddChat: vi.fn()
}));

describe('ChatBar Component', () => {
    const mockChats: Chat[] = [
        { chat_id: 1, title: 'Project Group', is_group: 1, display_name: 'Group', contact_ids: [{contact_id: 1}], last_message: null },
        { 
            chat_id: 2, 
            title: '', 
            is_group: 0, 
            display_name: 'Alice', 
            contact_ids: [{contact_id: 2}], 
            last_message: { id: 1, status: 'INCOMING_UNREAD', content: 'Hi' } as any 
        }
    ];

    beforeEach(() => {
        // Reset stores to a known clean state
        activeChat.set(DEFAULT_CHAT);
        chatStore.setChats([]);
        userStore.setUser('TestUser', 'onion_12345');
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    it('renders the empty state when no chats exist', () => {
        render(ChatBar);
        expect(screen.getByText('No chats yet.')).toBeTruthy();
    });

    it('renders the chat list, displays group titles, and shows unread indicators', () => {
        chatStore.setChats(mockChats);
        const { container } = render(ChatBar);

        // Validates correct name mapping based on is_group flag
        expect(screen.getByText('Project Group')).toBeTruthy();
        expect(screen.getByText('Alice')).toBeTruthy();

        // Validates that the unread dot is rendered for Alice (chat_id 2)
        const unreadDot = container.querySelector('.unread-dot');
        expect(unreadDot).toBeTruthy();
    });

    it('updates the activeChat store when a chat item is clicked', async () => {
        chatStore.setChats(mockChats);
        render(ChatBar);

        const aliceButton = screen.getByText('Alice');
        await fireEvent.click(aliceButton);

        // Verifies the global store updated correctly
        expect(get(activeChat).chat_id).toBe(2);
    });

    it('opens the Account Info modal and displays userStore data', async () => {
        render(ChatBar);

        // Modal should be closed initially
        expect(screen.queryByText('Account Info')).toBeNull();

        // Open modal via the title attribute on the button
        const accountBtn = screen.getByTitle('Account');
        await fireEvent.click(accountBtn);

        // Verifies the modal opened and bound to the store successfully
        expect(screen.getByText('Account Info')).toBeTruthy();
        expect(screen.getByText('TestUser')).toBeTruthy();
        expect(screen.getByText('onion_12345')).toBeTruthy();
    });

    it('opens the New Chat modal, submits data, and triggers the controller', async () => {
        render(ChatBar);

        const newChatBtn = screen.getByTitle('New Chat');
        await fireEvent.click(newChatBtn);

        // Bind to inputs
        const aliasInput = screen.getByPlaceholderText('johndoe') as HTMLInputElement;
        const onionInput = screen.getByPlaceholderText('vww6yba...') as HTMLInputElement;
        const submitBtn = screen.getByText('Chat');

        // Simulate typing
        await fireEvent.input(aliasInput, { target: { value: 'Bob' } });
        await fireEvent.input(onionInput, { target: { value: 'bob_onion' } });

        // Submit form
        await fireEvent.click(submitBtn);

        // Validates the controller was called and the modal automatically closed
        expect(onAddChat).toHaveBeenCalledWith('Bob', 'bob_onion');
        expect(screen.queryByText('New Chat')).toBeNull();
    });

    it('prevents submission if the New Chat form is incomplete', async () => {
        render(ChatBar);

        const newChatBtn = screen.getByTitle('New Chat');
        await fireEvent.click(newChatBtn);

        const aliasInput = screen.getByPlaceholderText('johndoe');
        const submitBtn = screen.getByText('Chat');

        // Only fill out half the form
        await fireEvent.input(aliasInput, { target: { value: 'Bob' } });
        await fireEvent.click(submitBtn);

        // Validates the controller blocked the submission
        expect(onAddChat).not.toHaveBeenCalled();
    });

    it('mutually excludes modals (opening one closes the other)', async () => {
        render(ChatBar);

        const accountBtn = screen.getByTitle('Account');
        const newChatBtn = screen.getByTitle('New Chat');

        // 1. Open Account Modal
        await fireEvent.click(accountBtn);
        expect(screen.queryByText('Account Info')).toBeTruthy();

        // 2. Open New Chat Modal
        await fireEvent.click(newChatBtn);
        
        // 3. Verify Account Modal closed automatically
        expect(screen.queryByText('Account Info')).toBeNull();
        expect(screen.queryByText('New Chat')).toBeTruthy();
    });
});