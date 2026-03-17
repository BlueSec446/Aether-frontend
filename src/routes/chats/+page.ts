import type { PageLoad } from './$types';
import { loadChats } from './chats';


export const load: PageLoad = async () => {
  // Automatically executed, when /chats is opend.
  let chats = await loadChats();

  return { chats: chats}
}