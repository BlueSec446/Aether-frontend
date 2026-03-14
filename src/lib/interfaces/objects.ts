/**
 * This file contains all TypeScript interfaces of objects, that the frontend will handle
 */

export type MessageStatus = 
    | "OUTGOING_CREATED" 
    | "OUTGOING_RECEIVED" 
    | "INCOMING_UNREAD" 
    | "INCOMING_READ";

export interface Message {
    id: number;  
    sender_contact_id: number | null;
    content: string;
    timestamp: string;
    status: MessageStatus;
}

export interface Chat {
    chat_id: number;
    is_group: 0 | 1; // 0 = Direct, 1 = Group
    contact_ids: [{ contact_id: number }] // One number, if chat is private chat
    title: string | null;
    last_message: Message | null;
}

export type ChatBarArray = Chat[];

export interface Contact {
    contact_id: number;
    alias: string;
    onion_adress: string;
}