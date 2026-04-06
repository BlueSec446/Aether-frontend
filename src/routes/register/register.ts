import { goto } from '$app/navigation';
import { resolve } from '$app/paths';

export async function postRegister(username: string, password: string) {
  try {
    // Backend Call via Context Bridge
    const responseJson = await window.frontendAPI.register(username, password);

    if (responseJson.status !== 'success') {
      console.error('Registration failed');
      alert('Registration failed');
    } else {
      console.log('Registration successful! Your Onion Address:', responseJson.onion_address);
      goto(resolve('/login')); // Open Login
    }
  } catch (error) {
    console.error('CRITICAL ERROR during registration:', error);
    alert('An unexpected error has occurred, registration failed');
  }
}
