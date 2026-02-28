// src/lib/mockData.ts
import type { Message, Contact, ChatBarArray} from './interfaces/interfaces'; // Adjust the import path as needed
import type { GetAllChats, GetOneChat, PostMessage } from './interfaces/response_objects'

// --- 1. MOCK CONTACTS ---
export const mockContacts: Contact[] = [
    {
        contactId: "cont_001",
        alias: "johndoe",
        onion_adress: "vww6yba14bd7szmgncyruucpgfkqahzddi37ktceo3ah7ngmcopnpyyd.onion"
    },
    {
        contactId: "cont_002",
        alias: "AliceHQ",
        onion_adress: "a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z.onion"
    }
];

// --- 2. MOCK MESSAGES ---
const mockMessagesChat1: Message[] = [
    {
        messageId: "msg_101",
        content: "Hey John, did you get the new Tor node running?",
        sender: "user",
        timestamp: "2026-02-28T14:30:00Z",
        status: "OUTGOING_RECEIVED"
    },
    {
        messageId: "msg_102",
        content: "Yes, just booted it up. Connection seems stable.",
        sender: "contact",
        timestamp: "2026-02-28T14:31:15Z",
        status: "INCOMING_READ"
    },
    {
        messageId: "msg_103",
        content: "Perfect. Let me know if the latency drops.",
        sender: "user",
        timestamp: "2026-02-28T14:32:00Z",
        status: "OUTGOING_RECEIVED"
    },
    {
        messageId: "msg_104",
        content: "Will do. I'll send the logs over shortly.",
        sender: "contact",
        timestamp: "2026-02-28T14:35:00Z",
        status: "INCOMING_UNREAD" // Good for testing an "unread" bold text UI
    }
];

const mockMessagesChat2: Message[] = [
    {
        messageId: "msg_201",
        content: "Alice, are we still on for the meeting?",
        sender: "user",
        timestamp: new Date().toISOString(),
        status: "OUTGOING_ATTEMPTED" // Good for testing a "loading/sending" spinner
    }
];

// --- 3. MOCK CONTROLLER RESPONSES ---

// Response for: GET /chats
export const mockGetAllChatsResponse: GetAllChats = {
    chats: [
        {
            chatId: "chat_001",
            alias: "johndoe",
            contactId: "cont_001",
            last_message: mockMessagesChat1[mockMessagesChat1.length - 1]
        },
        {
            chatId: "chat_002",
            alias: "AliceHQ",
            contactId: "cont_002",
            last_message: mockMessagesChat2[0]
        }
    ]
};

// Response for: GET /chat/{chatId}
export const mockGetOneChatResponse: GetOneChat = {
    chat: {
        chatId: "chat_001",
        messages: mockMessagesChat1
    }
};

// Response for: POST /chat/{chatId}/message
export const mockPostMessageResponse: PostMessage = {
    messageId: "msg_new_999"
};