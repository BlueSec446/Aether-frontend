import type { Message } from "$lib/interfaces/objects";
import type {  } from "$lib/interfaces/response_objects";
import { mockGetOneChatResponse } from "$lib/mock_data";

export async function loadChat(chatId: number){
    return mockGetOneChatResponse;

    const responseJson = await window.frontendAPI.getMessages(chatId);

    return responseJson;
}

export async function postMessage(chatId: number, message: Message) {
    let content = message.content;
    let timestamp = message.timestamp.toString();

    const responseJson = await window.frontendAPI.sendMessage(chatId, content=message.content);

    return responseJson.message_id;
}