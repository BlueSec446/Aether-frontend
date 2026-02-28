import type { ChatBarArray } from "$lib/interfaces/interfaces";

export function sortChats(chats: ChatBarArray) {
  const sortedChatBarArray = [...chats].sort((a,b) => {
    return new Date(a.last_message.timestamp).getTime() - new Date(b.last_message.timestamp).getTime()
  });
  
  return sortedChatBarArray;
}