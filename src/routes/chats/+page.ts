import type { PageLoad } from './$types';
import type { Chat } from "$lib/interfaces/objects"
import type {  } from '$lib/interfaces/response_objects';
import { mockGetAllChatsResponse } from '$lib/mock_data';


export const load: PageLoad = async () => {
  // Fetches the chat list before the UI mounts
  return { chats: mockGetAllChatsResponse }
  
  const responseJson: Chat[] = await window.frontendAPI.getChats();

  return responseJson;
}
