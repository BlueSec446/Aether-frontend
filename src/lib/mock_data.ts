/**
 * mock_data.ts
 * Provides standardized mock responses for all frontendAPI calls to allow 
 * UI development without needing the Python backend running.
 */
import type { Chat, Contact, Message } from "$lib/interfaces/objects";
import type { 
    AuthResponse, BaseResponse, ExportResponse, 
    SendMessageResponse, SyncResponse, SystemStatusResponse 
} from "$lib/interfaces/response_objects";

// ==========================================
// 1. MOCK DOMAIN ENTITIES (State)
// ==========================================

export const mockContacts: Contact[] = [
    { contact_id: 1, alias: "Elena", onion_adress: "v2c7q3...onion" },
    { contact_id: 2, alias: "Marcus", onion_adress: "x9f3z1...onion" }
];

// Message history for Chat 1 (with Elena)
export const mockMessagesChat1: Message[] = [
    { 
        id: 101,
        chat_id: 1, 
        sender_contact_id: 1, 
        content: "Do you have the documents?", 
        timestamp: "2026-03-17T14:30:00Z", 
        status: "INCOMING_READ" 
    },
    { 
        id: 102,
        chat_id: 1, 
        sender_contact_id: null, // null means we sent it
        content: "Yes, I will send them over Tor tonight.", 
        timestamp: "2026-03-17T14:35:00Z", 
        status: "OUTGOING_RECEIVED" 
    }
];

// Message history for Chat 2 (with Marcus)
export const mockMessagesChat2: Message[] = [
    { 
        id: 201, 
        chat_id: 2,
        sender_contact_id: null, 
        content: "Are we still meeting at the drop?", 
        timestamp: "2026-03-16T09:00:00Z", 
        status: "OUTGOING_RECEIVED" 
    },
    { 
        id: 202, 
        chat_id: 2,
        sender_contact_id: 2, 
        content: "Location compromised. Abort.", 
        timestamp: "2026-03-17T16:45:00Z", 
        status: "INCOMING_UNREAD" // Example of an unread message to test UI badges
    }
];

// The Chat List
export const mockChats: Chat[] = [
    {
        chat_id: 1,
        is_group: 0,
        contact_ids: [{ contact_id: 1 }],
        title: "Elena",
        last_message: mockMessagesChat1[mockMessagesChat1.length - 1]
    },
    {
        chat_id: 2,
        is_group: 0,
        contact_ids: [{ contact_id: 2 }],
        title: "Marcus",
        last_message: mockMessagesChat2[mockMessagesChat2.length - 1]
    }
];


// ==========================================
// 2. MOCK API RESPONSES
// ==========================================

// --- Generic / Reusable ---
export const mockBaseSuccess: BaseResponse = { 
    status: "success", 
    message: "Operation completed successfully." 
};

// --- Auth ---
export const mockLoginSuccess: AuthResponse = { 
    status: "success", 
    message: "Database unlocked.", 
    onion_address: "my5w8b...onion" 
};

export const mockRegisterSuccess: AuthResponse = { 
    status: "success", 
    message: "Profile created.", 
    onion_address: "my5w8b...onion" 
};

// --- Contacts ---
export const mockNewContactCreated: Contact = { 
    contact_id: 3, 
    alias: "NewSource", 
    onion_adress: "z1q8m4...onion" 
};

// --- Messages ---
export const mockSendMessageSuccess: SendMessageResponse = { 
    message_id: 999, 
    status: "OUTGOING_CREATED" // The message is queued for the Tor worker
};

// --- System & Sync ---
export const mockSystemStatusReady: SystemStatusResponse = { 
    tor_bootstrap_percent: 100, 
    status: "ready" 
};

export const mockSystemStatusBootstrapping: SystemStatusResponse = { 
    tor_bootstrap_percent: 45, 
    status: "bootstrapping" 
};

export const mockSyncData: SyncResponse = {
    new_messages: [
        { 
            id: 301, 
            chat_id: 1,
            sender_contact_id: 1, 
            content: "Update: The package is secure.", 
            timestamp: "2026-03-17T16:50:00Z", 
            status: "INCOMING_UNREAD" 
        }
    ],
    status_updates: [
        { 
            message_id: 999,
            chat_id: 1,
            status: "OUTGOING_RECEIVED" // Simulates an older message finally being delivered
        }
    ]
};

// --- Export ---
export const mockExportSuccess: ExportResponse = { 
    status: "success", 
    message: "Backup created securely.",
    file_path: "/home/user/exports/aether_backup.aetherbak" 
};