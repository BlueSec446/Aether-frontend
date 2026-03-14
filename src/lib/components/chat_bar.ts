import type { ChatBarArray } from "$lib/interfaces/objects";

export function sortChats(chats: ChatBarArray) {
  return [...chats].sort((a, b) => {
    const timeA = a.last_message ? new Date(a.last_message.timestamp).getTime() : 0;
    const timeB = b.last_message ? new Date(b.last_message.timestamp).getTime() : 0;

    return timeB - timeA; 
  });
}