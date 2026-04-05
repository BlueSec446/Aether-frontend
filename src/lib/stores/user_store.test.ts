import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { userStore } from './user_store';

describe('User Store', () => {
    beforeEach(() => {
        userStore.clear();
    });

    it('initializes with empty values', () => {
        const store = get(userStore);
        expect(store.display_name).toBe('');
        expect(store.onion_address).toBe('');
    });

    it('sets the user profile successfully', () => {
        userStore.setUser('JohnDoe', 'vww6yba...');
        
        const store = get(userStore);
        expect(store.display_name).toBe('JohnDoe');
        expect(store.onion_address).toBe('vww6yba...');
    });

    it('updates the alias correctly', () => {
        userStore.setUser('JohnDoe', 'vww6yba...');
        userStore.updateAlias('JaneDoe');
        
        const store = get(userStore);
        expect(store.display_name).toBe('JaneDoe');
        expect(store.onion_address).toBe('vww6yba...'); // Onion should be untouched
    });
});