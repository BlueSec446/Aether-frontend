/** 
 * This file defines the response Objects the frontend will receive from the Controller 
*/
import type { Message, MessageStatus } from "./objects";

// Base response for generic operations (e.g., Delete, Update, Logout)
export interface BaseResponse {
    status: "success" | "error";
    message?: string;
}

// Returned by POST /auth/register and POST /auth/login
export interface AuthResponse extends BaseResponse {
    onion_address?: string;
}

// Returned by POST /messages
export interface SendMessageResponse {
    message_id: number;
    status: MessageStatus;
}

// Returned by GET /system/status
export interface SystemStatusResponse {
    tor_bootstrap_percent: number;
    status: string; // e.g. "ready", "bootstrapping", "offline"
}

// Sub-interface for the Sync payload
export interface StatusUpdate {
    chat_id: number;
    message_id: number;
    status: MessageStatus;
}

// Returned by GET /system/sync?since={timestamp}
export interface SyncResponse {
    new_messages: Message[];
    status_updates: StatusUpdate[];
}

// Returned by POST /export
export interface ExportResponse extends BaseResponse {
    file_path: string;
}