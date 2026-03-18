import { activeChat } from "$lib/stores/active_chat_store";
import { chatStore } from "$lib/stores/chat_store";
import { get } from "svelte/store";
import { loadChats } from "../../routes/chats/chats";


export async function onAddChat(alias: string, onionAdress: string){
  //BACKEND Hier Logik einfügen
  let newC = await window.frontendAPI.newContact(alias, onionAdress);
  
  await loadChats();

  const newChat = get(chatStore).find(c => c.contact_ids[0].contact_id === newC.contact_id);
  
  if (newChat) {
    activeChat.set(newChat);
  } else {
    console.log("No new Chat found!");
  }
}