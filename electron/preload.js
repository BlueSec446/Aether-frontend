const { contextBridge } = require('electron');

const API_KEY = process.env.AETHER_API_KEY; 
const API_BASE_URL = 'http://127.0.0.1:5000/api/v1';


async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-Aether-API-Key': API_KEY,
        ...options.headers
    };

    try {
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const backendMessage = errorData.message || response.statusText;
            throw new Error(backendMessage);
        }
        return await response.json();
    } catch (error) {
        console.error(`[Secure API Bridge] Failed call to ${endpoint}:`, error);
        throw error; //Maybe ausklammern?
    }
}

contextBridge.exposeInMainWorld("frontendAPI", {
    /** 
     * API Functions that get exposed to the frontend. 
     * Works as Facade between frontend and Python Flask
    */

    // Authentication & Profile Management
    register: (username, password) =>
        apiCall(`/auth/register`, { 
            method: "POST", 
            body: JSON.stringify({ 
                "username": username, 
                "password": password }) 
    }),

    login: (username, password) => 
        apiCall(`/auth/login`, { 
            method: "POST", 
            body: JSON.stringify({ 
                "username": username, 
                "password": password }) 
    }),

    logout: () =>
        apiCall(`/auth/logout`, {
            method: "POST"
        }),

    // Contact handeling
    getContacts: () => //Möglicherweise überflüssig, weil Workflow getAllChats -> getChat -> sendet contactID mit, für zukünftige Entwicklung bestimmt nicht schlecht zu haben
        apiCall(`/contacts`, {
            method: "GET"
        }),
    
    newContact: (onionAdress, alias) =>
        apiCall(`/contacs`, {
            method: "POST",
            body: JSON.stringify({
                "onion_adress": onionAdress, 
                "display_name": alias
            })
        }),

    updateContactAlias: (contactId, newAlias) =>
        apiCall(`/contacts/${contactId}`, {
            method: "PUT",
            body: JSON.stringify({
                "display_name": newAlias
            })
        }),

    deleteContact: (contactId) => 
        apiCall(`/contacts/${contactId}`, {
            method: "DELETE"
        }),

    // Chats & Messages
    getChats: () =>
        // Returns all chats including their most recent message
        apiCall(`/chats`, {
            method: "GET"
        }),
    
    getMessages: (chatId) =>
        // Returns the full message history for a specific chat
        apiCall(`/chats/${chatId}/messages`, {
            method: "GET"
        }),

    deleteMessages: (chatId) =>
        // Securely wipes the message history of a chat
        apiCall(`/chats/${chatId}`, {
            method: "DELETE"
        }),
    
    sendMessage: (chatId, content) =>
        // Queues a new message to send by the backend
        apiCall(`/messages`, {
            method: "POST",
            body: JSON.stringify({
                "chat_id": chatId,
                "content": content
            })
        }),

    deleteMessage: (messageId) =>
        // Deletes a specific message
        apiCall(`/messages/${messageId}`, {
            method: "POST"
        }),

    // System, Polling & Export
    systemStatus: () =>
        // Returns the current Tor daemon bootstrap percentage and network health
        apiCall(`/system/status`, {
            method: "GET"
        }),

    sync: (lastSync) =>
        // Checks if status updates or new messages got handled by the backend 
        apiCall(`/system/sync?since=${lastSync}`, {
            method: "GET"
        }),

    export: (exportPassword, includeChats) =>
        // Generates a JSON archive to export Indentity, Contactas and optionally Chats
        apiCall(`/export`, {
            method: "POST",
            body: JSON.stringify({
                "export_password": exportPassword,
                "include_chats": includeChats
            })
        })
});