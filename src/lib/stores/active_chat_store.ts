/**
 * This global available store handles the activeChat
 */
import { writable } from 'svelte/store';
import type { Chat } from '$lib/interfaces/objects';

export const DEFAULT_CHAT: Chat = {
  chat_id: -1,
  is_group: 0,
  contact_ids: [{ contact_id: -1 }],
  title: '',
  display_name: '',
  last_message: null
};

export const activeChat = writable<Chat>(DEFAULT_CHAT);
