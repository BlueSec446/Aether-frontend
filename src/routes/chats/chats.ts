import type { Chat } from "$lib/interfaces/objects"
import { mockChats } from '$lib/mock_data';

export async function newContact(alias: string, onionAdress: string) {
    const responseJson = await window.frontendAPI.newContact(onionAdress, alias);

    return responseJson;
}


export async function loadChats() {
    // Fetches the chat list before the UI mounts
    let mockChatsResponse: Chat[] = mockChats; 
    return sortChats(mockChatsResponse);

    // Backend dev, hier get Chats. Eigentlicher API-Call ist das hier
    const responseJson: Chat[] = await window.frontendAPI.getChats();

    return sortChats(responseJson);
}


export function sortChats(chats: Chat[]) {
    // Sort chat array ascending based on the timestamp of the last message 
    return [...chats].sort((a, b) => {
    const timeA = a.last_message ? new Date(a.last_message.timestamp).getTime() : 0;
    const timeB = b.last_message ? new Date(b.last_message.timestamp).getTime() : 0;

    return timeB - timeA; 
    });
}