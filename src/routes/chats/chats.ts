import { get } from 'svelte/store';
import type { Chat } from "$lib/interfaces/objects"
import { chatStore } from "$lib/stores/chat_store";
import { mockChats } from '$lib/mock_data';
import { activeChat } from "$lib/stores/active_chat_store";
import type { SyncResponse } from '$lib/interfaces/response_objects';
import { messageStore } from '$lib/stores/messages_store';


export async function loadChats() {
    // Fetches the chat list before the UI mounts
    let mockChatsResponse: Chat[] = mockChats; 
    chatStore.setChats(mockChatsResponse);

    //BACKEND dev, hier GET Chats. Eigentlicher API-Call ist das hier
    /**const responseJson: Chat[] = await window.frontendAPI.getChats();

    chatStore.setChats(mockChatsResponse); 
    activeChat.set(get(chatStore)[0]);*/

    // Check if a chat is already active and keep it active
    if (get(activeChat).chat_id !== -1){
        // Update activeChat (if changes happend)
        activeChat.set(chatStore.getOneChat(get(activeChat).chat_id));
    }
}

export async function sync(lastSync: string) {
    //BACKEND hier Logik einfügen
    const currentTime = Date.now().toString();
    //const responseJson = await window.frontendAPI.sync(lastSync);
    console.log("I got executed!!");
    //processSyncData(responseJson);
    return currentTime;
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
    //BACKEND hier logik einfügen
    const responseJson = await window.frontendAPI.systemStatus();
}