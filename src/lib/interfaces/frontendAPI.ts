/**
 * Interface of the API Functions
 * What Arguments they take and how the Response Objects look like
 */
import type { Chat, Contact, Message } from './objects';
import type {
  AuthResponse,
  BaseResponse,
  ExportResponse,
  SendMessageResponse,
  SyncResponse,
  SystemStatusResponse
} from './response_objects';

export interface FrontendAPI {
  // Auth
  register: (u: string, p: string) => Promise<AuthResponse>;
  login: (u: string, p: string) => Promise<AuthResponse>;
  logout: () => Promise<BaseResponse>;

  // Contacts
  getContacts: () => Promise<Contact[]>;
  newContact: (onion: string, alias: string) => Promise<Contact>;
  updateContactAlias: (id: number, alias: string) => Promise<BaseResponse>;
  deleteContact: (id: number) => Promise<BaseResponse>;

  // Chats & Messages
  getChats: () => Promise<Chat[]>;
  getMessages: (chatId: number) => Promise<Message[]>;
  deleteMessages: (chatId: number) => Promise<BaseResponse>;
  sendMessage: (chatId: number, content: string) => Promise<SendMessageResponse>;
  deleteMessage: (messageId: number) => Promise<BaseResponse>;

  // System & Sync
  systemStatus: () => Promise<SystemStatusResponse>;
  sync: (timestamp: string) => Promise<SyncResponse>;
  export: (password: string, includeChats: boolean) => Promise<ExportResponse>;
}
