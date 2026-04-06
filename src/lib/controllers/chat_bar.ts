/**
 * @file Controller for the ChatBar component.
 * @description Acts as the bridge between the sidebar UI and the `frontendAPI`.
 * Isolates the business logic for fetching contacts, hydrating the chat list store,
 * and handling new contact registration (via Onion Addresses) to keep the Svelte
 * component purely presentational.
 */
import { activeChat } from '$lib/stores/active_chat_store';
import { chatStore } from '$lib/stores/chat_store';
import { get } from 'svelte/store';
import { loadChats } from './chats_wrapper';

export async function onAddChat(alias: string, onionAddress: string) {
  try {
    const newContact = await window.frontendAPI.newContact(onionAddress, alias);

    await loadChats();

    if (newContact && newContact.id) {
      const chats = get(chatStore);
      const newChat = chats.find((chat) =>
        chat.contact_ids?.some((contact) => contact.contact_id === newContact.id)
      );

      if (newChat) {
        activeChat.set(newChat);
      } else {
        console.warn('Neuer Chat wurde nicht in der Chat-Liste gefunden.');
      }
    }
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kontakts:', error);
    alert(`Kontakt konnte nicht hinzugefügt werden. \n${error}`);
  }
}
