/**
 * Handler for register page
 */
import { userStore } from '$lib/stores/user_store';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export async function postLogin(username: string, password: string) {
  try {
    // Backend Call via Context Bridge
    const responseJson = await window.frontendAPI.login(username, password);

    if (responseJson.status !== 'success') {
      console.error('Login failed');
      alert('Login failed');
    } else {
      // Speichere Username und die vom Backend erhaltene Onion-Adresse im Store
      userStore.setUser(username, responseJson.onion_address);
      goto(resolve('/chats')); // Open Chats
    }
  } catch (error) {
    console.error('CRITICAL ERROR during login:', error);
    alert('An unexpected error occurred, login failed');
  }
}
