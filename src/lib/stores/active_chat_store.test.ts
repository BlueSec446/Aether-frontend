import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { activeChat, DEFAULT_CHAT } from './active_chat_store';
import type { Chat } from '$lib/interfaces/objects';

describe('Active Chat Store', () => {
    // Reset before every test to ensure a clean slate
    beforeEach(() => {
        activeChat.set(DEFAULT_CHAT);
    });

    it('initializes with the DEFAULT_CHAT object', () => {
        expect(get(activeChat)).toEqual(DEFAULT_CHAT);
    });

    it('updates to a newly selected chat', () => {
        const mockChat: Chat = {
            chat_id: 1,
            is_group: 0,
            contact_ids: [{ contact_id: 2 }],
            title: "Alice",
            display_name: "Alice",
            last_message: null
        };

        activeChat.set(mockChat);
        expect(get(activeChat)).toEqual(mockChat);
        expect(get(activeChat).chat_id).toBe(1);
    });
});