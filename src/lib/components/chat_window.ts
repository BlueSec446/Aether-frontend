import type { Message } from "$lib/interfaces/objects";
import { messageStore } from "$lib/stores/messages_store";
import { activeChat, DEFAULT_CHAT } from "$lib/stores/active_chat_store";
import { get } from "svelte/store";
import { loadChats } from "../../routes/chats/chats";

export async function loadChat(){
    const currentChat = get(activeChat);
    if (currentChat.chat_id === -1 ) return;

    try {
        const responseJson = await window.frontendAPI.getMessages(currentChat.chat_id);
        messageStore.setMessages(responseJson);
    } catch (error) {
        console.error("Fehler beim Laden des Chats:", error);
    }
}

export async function postMessage(message: Message) {
    // Sofortiges UI-Feedback
    while (get(messageStore).find(m => m.id === message.id)) {
        // If several messages are being sent the m.id is updated to the first negative number that is not stored inside messageStore
        message.id -= 1;
    }
    messageStore.addMessage(message);

    try {
        // chat_id (nicht chatId!)
        const responseJson = await window.frontendAPI.sendMessage(get(activeChat).chat_id, message.content);
        
        // Ersetzt die Dummy-ID durch die echte ID aus der DB und updatet den Status auf "OUTGOING_CREATED"
        messageStore.updateMessageAfterSend(message.id, responseJson.message_id, responseJson.status);
    } catch (error) {
        console.error("Fehler beim Senden der Nachricht:", error);
        // Optional: Hier könnte man den Status der Nachricht auf "FAILED" setzen, falls du das ins UI einbaust
    }
}

export async function removeMessage(message: Message) {
    // Optimistic UI Update: Zuerst lokal löschen
    messageStore.deleteMessage(message);

    try {
        const responseJson = await window.frontendAPI.deleteMessage(message.id);
        if (responseJson.status !== "success") throw new Error("Backend meldet Fehler beim Löschen.");
    } catch (error) {
        console.error("Nachricht konnte nicht gelöscht werden:", error);
        // Rollback: Nachricht wieder einfügen
        messageStore.addMessage(message); 
    }
}

export async function clearChat() {
    const currentChatId = get(activeChat).chat_id;
    if (currentChatId === -1) return;    

    const messagesBackup = get(messageStore);
    messageStore.reset();

    try {
        const responseJson = await window.frontendAPI.deleteMessages(currentChatId);
        if (responseJson.status !== "success") throw new Error("Backend meldet Fehler beim Leeren.");
    } catch (error) {
        console.error("Chat konnte nicht geleert werden:", error);
        // Rollback
        messageStore.setMessages(messagesBackup);
    }
}

// Contact Functions
export async function updateAlias(id: number, newAlias: string) {
    const previousChat = get(activeChat);

    // Optimistisches Update des aktiven Chats im UI
    activeChat.set({ ...previousChat, title: newAlias });
    
    try {
        await window.frontendAPI.updateContactAlias(id, newAlias);
        await loadChats(); // Chatliste links ebenfalls aktualisieren
    } catch (error) {
        console.error("Alias konnte nicht geändert werden:", error);
        // Rollback bei Fehler: vorherigen Zustand wiederherstellen
        activeChat.set(previousChat);
    }
}

export async function deleteContact(){
    const currentChat = get(activeChat);
    if (currentChat.chat_id === -1) return;

    if (currentChat.is_group === 1) {
        await clearChat();
    } else {
        try {
            const contactId = currentChat.contact_ids[0].contact_id;
            const responseJson = await window.frontendAPI.deleteContact(contactId);
            
            if (responseJson.status === "success") {
                activeChat.set(DEFAULT_CHAT); // Chat-Fenster schließen
                await loadChats(); // Kontaktliste aktualisieren
            } else {
                throw new Error("Löschen fehlgeschlagen.");
            }
        } catch (error) {
            console.error("Fehler beim Löschen des Kontakts:", error);
        }
    }
}

export async function exportContent(exportPW: string, includeChats: boolean){
    try {
        const responseJson = await window.frontendAPI.export(exportPW, includeChats);
        if (responseJson.status === "success") {
            return responseJson.file_path;
        } else {
            throw new Error(responseJson.message || "Export fehlgeschlagen.");
        }
    } catch (error) {
        console.error("Fehler beim Exportieren:", error);
        return null;
    }
}