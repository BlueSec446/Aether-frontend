// src/lib/mockData.ts
import type { Message, Contact, ChatBarArray, Chat} from './interfaces/objects'; // Adjust the import path as needed
import type { SendMessageResponse } from './interfaces/response_objects'

// --- 1. MOCK CONTACTS ---
export const mockContacts: Contact[] = [
    {
        contact_id: 1,
        alias: "johndoe",
        onion_adress: "vww6yba14bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd.onion"
    },
    {
        contact_id: 2,
        alias: "AliceHQ",
        onion_adress: "a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z.onion"
    }
];

// --- 2. MOCK MESSAGES ---
const mockMessagesChat1: Message[] = [
    {
        id: 101,
        content: "Hey John, did you get the new Tor node running?",
        sender_contact_id: null,
        timestamp: "2026-02-28T14:30:00Z",
        status: "OUTGOING_RECEIVED"
    },
    {
        id: 102,
        content: "Yes, just booted it up. Connection seems stable.",
        sender_contact_id: 1,
        timestamp: "2026-02-28T14:31:15Z",
        status: "INCOMING_READ"
    },
    {
        id: 103,
        content: "Perfect. Let me know if the latency drops.",
        sender_contact_id: null,
        timestamp: "2026-02-28T14:32:00Z",
        status: "OUTGOING_RECEIVED"
    },
    {
        id: 104,
        content: "Will do. I'll send the logs over shortly.",
        sender_contact_id: 1,
        timestamp: "2026-02-28T14:35:00Z",
        status: "INCOMING_UNREAD" // Good for testing an "unread" bold text UI
    }
];

const mockMessagesChat2: Message[] = [
    {
        id: 201,
        content: "Alice, are we still on for the meeting?",
        sender_contact_id: null,
        timestamp: new Date().toISOString(),
        status: "OUTGOING_CREATED" // Good for testing a "loading/sending" spinner
    }
];

// --- 3. MOCK CONTROLLER RESPONSES ---

// Response for: GET /chats
export const mockGetAllChatsResponse: Chat[] = [
    {
        chat_id: 1,
        is_group: 0,
        title: "johndoe",
        contact_ids: [{contact_id: 1}],
        last_message: mockMessagesChat1[mockMessagesChat1.length - 1]
    },
    {
        chat_id: 2,
        is_group: 0,
        title: "AliceHQ",
        contact_ids: [{contact_id: 2}],
        last_message: mockMessagesChat2[0]
    }
];

// Response for: GET /chat/{chatId}
export const mockGetOneChatResponse: Message[] = mockMessagesChat1; 

// Response for: POST /chat/{chatId}/message
export const mockPostMessageResponse: SendMessageResponse = {
    message_id: Math.random(),
    status: "OUTGOING_CREATED"
};