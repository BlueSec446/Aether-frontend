/** 
 * This file defines the response Objects the frontend will receive from the Controller 
*/
import type { Chat } from "./interfaces"
import type { ChatBarArray } from "./interfaces"

export interface GetAllChats {
  chats: ChatBarArray
}

export interface GetOneChat {
    chat: Chat
}

export interface PostMessage {
    messageId: string
}

export interface PostLogin {
    //T.b.d.
}