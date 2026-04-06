/**
 * @file Reactive store for the currently selected conversation.
 * @description Decouples the active chat selection from the UI components.
 * Allows the `ChatBar` to update the user's current focus, which reactively
 * triggers the `ChatsWrapper` to swap components and the `ChatWindow` to fetch
 * the corresponding message history, all without direct component-to-component prop drilling.
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
