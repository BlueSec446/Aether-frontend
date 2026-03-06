export interface Message {
    messageId: string | null;
    content: string;
    sender: 'user' | 'contact';
    timestamp: Date | string;
    status: 'OUTGOING_CREATED' | 
            'OUTGOING_ATTEMPTED' | 
            'OUTGOING_RECEIVED' | 
            'INCOMING_UNREAD' | 
            'INCOMING_READ';
}

export interface Chat {
    chatId: string;
    messages: Array<Message>
}

export interface ChatBarElem {
    chatId: string;
    alias: string;
    contactId: string;
    last_message: Message;
}

export type ChatBarArray = ChatBarElem[];

export interface Contact {
    contactId: string;
    alias: string;
    onion_adress: string;
}