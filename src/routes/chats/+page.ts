import { apiCall } from '$lib/api';
import type { PageLoad } from './$types';
import type { ChatBarArray } from "$lib/interfaces/interfaces"
import type { GetAllChats } from '$lib/interfaces/response_objects';
import { mockGetAllChatsResponse } from '$lib/mock_data';


export const load: PageLoad = async () => {
  // Fetches the chat list before the UI mounts
  return { chats: mockGetAllChatsResponse.chats }
  
  const responseJson = await apiCall<GetAllChats>('/allChats', {
    method: "GET"
  });
  let chats = responseJson.chats;

  return { chats: chats }; 
}
