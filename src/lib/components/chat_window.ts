import type { Message } from "$lib/interfaces/objects";
import { messageStore } from "$lib/stores/messages_store";
import { activeChat } from "$lib/stores/active_chat_store";
import { mockMessagesChat1, mockMessagesChat2 } from "$lib/mock_data";
import { get } from "svelte/store";

export async function loadChat(){
    if (get(activeChat).chat_id === -1 ) {
        return;
    }

    if (get(activeChat).chat_id == 1) {
        messageStore.setMessages(mockMessagesChat1);
    } else {
        messageStore.setMessages(mockMessagesChat2);
    }

    //BACKEND hier Logik einfügen
    const responseJson = await window.frontendAPI.getMessages(get(activeChat).chat_id);

    messageStore.setMessages(responseJson);
}

export async function postMessage(message: Message) {
    messageStore.addMessage(message);

    let content = message.content;
    let timestamp = message.timestamp.toString();
    
    //BACKEND hier Logik einfügen
//    const responseJson = await window.frontendAPI.sendMessage(get(activeChat).chatId, content=message.content);

//    messageStore.addMessageAfterSend(responseJson.message_id, responseJson.status);
}


export async function removeMessage(message: Message) {
    messageStore.deleteMessage(message);

    //BACKEND hier logik einfügen
    const responseJson = await window.frontendAPI.deleteMessage(message.id);

    // if (not succesful) {
    //    messageStore.addMessage(message); // Insert message again, if delete not successful
    //}
}


export async function clearChat() {
    if (get(activeChat).chat_id === -1) {
        return;    
    }

    const messages = get(messageStore);
    messageStore.reset();

    //BACKEND hier Logik einfügen
    const responseJson = await window.frontendAPI.deleteMessages(get(activeChat).chat_id);

    //if (not successful) {
    //    messageStore.setMessages(messages);
    //}
}

// Contact Functions
export async function updateAlias(id: number, newAlias: string) {
    let currentChat = get(activeChat);
    currentChat.title = newAlias;
    activeChat.set(currentChat);
    
    //BACKEND Hier logik einfügen
    const responseJson = await window.frontendAPI.updateContactAlias(id, newAlias);
}


export async function deleteContact(){
    if (get(activeChat).chat_id === -1){
        return;
    }

    if (get(activeChat).is_group === 1) {
        // No group handeling, so default to clearChat
        await clearChat();
    } else {
        //BACKEND Hier Logik einfügen
        const responseJson = await window.frontendAPI.deleteContact(get(activeChat).contact_ids[0].contact_id);
    }
}

export async function exportContent(exportPW: string, includeChats: boolean){
    //BACKEND hier Logik einfügen
    const responseJson = await window.frontendAPI.export(exportPW, includeChats);

    return responseJson.file_path;
}