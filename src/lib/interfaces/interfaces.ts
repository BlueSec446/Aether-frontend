interface Message {
    message_id: number | null;
    content: string;
    sender: 'user' | 'contact';
    timestamp: Date;
    status: 'OUTGOING_CREATED' | 
            'OUTGOING_ATTEMPTED' | 
            'OUTGOING_RECEIVED' | 
            'INCOMING_UNREAD' | 
            'INCOMING_READ';
}

interface Chat {
    chat_id: number;
    messages: Array<Message>
}

interface Chats {
    chat_id: number;
    alias: string;
    contact_id: number;
    last_message: Message;
}

interface Contact {
    contact_id: number;
    alias: string;
    onion_adress: string;
}