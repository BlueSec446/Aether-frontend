/**
 * @file Reactive store for the local user's profile and global application state.
 * @description Manages the authenticated user's identity (e.g., their Onion Address,
 * local alias, and system preferences). Decoupling this from the UI ensures that
 * any component across the application—whether it's the settings modal, the profile
 * header, or message bubbles determining if a message was sent by "me"—can reactively
 * access the user's context without prop drilling.
 */
import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/interfaces/objects';

const initialState: UserProfile = {
  display_name: '',
  onion_address: ''
};

function createUserStore() {
  const { subscribe, set, update } = writable<UserProfile>(initialState);

  return {
    // Expose subscribe so Svelte's $ syntax works automatically in your HTML
    subscribe,

    setUser: (display_name: string, onion_address: string) => {
      set({ display_name, onion_address });
    },

    updateAlias: (newAlias: string) =>
      update((state) => {
        return { ...state, display_name: newAlias };
      }),

    clear: () => set(initialState)
  };
}

export const userStore = createUserStore();
