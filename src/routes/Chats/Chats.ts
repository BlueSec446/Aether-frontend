import { apiCall } from '$lib/api';

export async function load() {
  // Fetches the chat list before the UI mounts
  const chats = await apiCall('/api/chats');
  console.log("This ")
  return { chats }; 
}