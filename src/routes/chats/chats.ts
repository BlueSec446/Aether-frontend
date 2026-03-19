import { get } from 'svelte/store';
import type { Chat } from "$lib/interfaces/objects"
import { chatStore } from "$lib/stores/chat_store";
import { activeChat } from "$lib/stores/active_chat_store";
import type { SyncResponse } from '$lib/interfaces/response_objects';
import { messageStore } from '$lib/stores/messages_store';

export async function loadChats() {
    try {
        // Echte Chats vom Backend abfragen
        const responseJson: Chat[] = await window.frontendAPI.getChats();
        chatStore.setChats(responseJson);

        // Prüfen, ob schon ein Chat aktiv ist und diesen ggf. aktualisieren
        const currentActive = get(activeChat);
        if (currentActive.chat_id !== -1){
            activeChat.set(chatStore.getOneChat(currentActive.chat_id));
        }
    } catch (error) {
        console.error("Fehler beim Laden der Chats:", error);
    }
}

export async function sync(lastSync: string) {
    try {
        const responseJson = await window.frontendAPI.sync(lastSync);
        processSyncData(responseJson);
        
        // Gebe die aktuelle Zeit im ISO-Format zurück (wird für den nächsten Request genutzt)
        return new Date().toISOString();
    } catch (error) {
        console.error("Fehler beim Sync:", error);
        return lastSync; // Bei Fehler alten Zeitstempel behalten, um nichts zu verpassen
    }
}

export function processSyncData(syncData: SyncResponse) {
    for (const newMsg of syncData.new_messages){
        chatStore.updateLastMessage(newMsg.chat_id, newMsg);
        
        if (get(activeChat).chat_id === newMsg.chat_id) {
            messageStore.addMessage(newMsg);
        }
    }

    for (const update of syncData.status_updates){
        chatStore.updateLastMessageStatus(update.chat_id, update.message_id, update.status);

        if (get(activeChat).chat_id === update.chat_id) {
            messageStore.updateMessageStatus(update.message_id, update.status);
        }
    }
}

export async function getSystemStatus(){
    try {
        return await window.frontendAPI.systemStatus();
    } catch (error) {
        console.error("System-Status konnte nicht abgerufen werden:", error);
        return null;
    }
}