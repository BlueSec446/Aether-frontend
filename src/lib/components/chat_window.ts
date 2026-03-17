import type { Message } from "$lib/interfaces/objects";
import type {  } from "$lib/interfaces/response_objects";
import { mockMessagesChat1, mockMessagesChat2 } from "$lib/mock_data";

export async function loadChat(chatId: number){
    if (chatId == 1) {
        return mockMessagesChat1;
    } else {
        return mockMessagesChat2;
    }

    const responseJson = await window.frontendAPI.getMessages(chatId);

    return responseJson;
}

export async function postMessage(chatId: number, message: Message) {
    let content = message.content;
    let timestamp = message.timestamp.toString();

    const responseJson = await window.frontendAPI.sendMessage(chatId, content=message.content);

    return responseJson.message_id;
}