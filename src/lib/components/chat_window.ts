import { apiCall } from "$lib/api";
import type { Message } from "$lib/interfaces/interfaces";
import type { GetOneChat, PostMessage } from "$lib/interfaces/response_objects";
import { mockGetOneChatResponse } from "$lib/mock_data";

export async function loadChat(chatId: string){
    return mockGetOneChatResponse.chat;

    const responseJson = await apiCall<GetOneChat>(`/chat/${chatId}`);

    return responseJson.chat;
}

export async function postMessage(chatId: string, message: Message) {
    let content = message.content;
    let timestamp = message.timestamp.toString();

    const responseJson = await apiCall<PostMessage>("/messages", {
        method: "POST",
        body: JSON.stringify({
            chat_id: chatId,
            message: {
                content: content,
                timestamp: timestamp
            }
        })
    });

    return responseJson.messageId;
}