/**
 * Globally available store to access and modify data about the current user 
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

        updateAlias: (newAlias: string) => update(state => {
            return { ...state, display_name: newAlias };
        }),

        clear: () => set(initialState)
    };
}

export const userStore = createUserStore();