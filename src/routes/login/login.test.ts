import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { postLogin } from './login';
import { userStore } from '$lib/stores/user_store';
import { goto } from '$app/navigation';

vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));

describe('Login Controller', () => {
    let consoleErrorMock: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        (window as any).frontendAPI = {
            login: vi.fn()
        };

        window.alert = vi.fn();
        consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        // Ensure clean state to validate post-login population
        userStore.clear(); 
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.restoreAllMocks();
    });

    it('populates userStore and grants access to /chats on success', async () => {
        (window.frontendAPI.login as any).mockResolvedValue({ 
            status: "success", 
            onion_address: "onion_vww6yba..." 
        });

        await postLogin('Alice', 'password123');

        expect(window.frontendAPI.login).toHaveBeenCalledWith('Alice', 'password123');
        expect(goto).toHaveBeenCalledWith('/chats');

        const store = get(userStore);
        expect(store.display_name).toBe('Alice');
        expect(store.onion_address).toBe('onion_vww6yba...');
    });

    it('blocks access and maintains empty identity on invalid credentials', async () => {
        (window.frontendAPI.login as any).mockResolvedValue({ status: "invalid_credentials" });

        await postLogin('Alice', 'wrong_password');

        expect(consoleErrorMock).toHaveBeenCalledWith('Login failed');
        expect(window.alert).toHaveBeenCalledWith('Login failed');
        expect(goto).not.toHaveBeenCalled();
        
        const store = get(userStore);
        expect(store.display_name).toBe('');
    });

    it('handles critical network failures gracefully', async () => {
        const mockError = new Error('500 Internal Server Error');
        (window.frontendAPI.login as any).mockRejectedValue(mockError);

        await postLogin('Alice', 'password123');

        expect(consoleErrorMock).toHaveBeenCalledWith('CRITICAL ERROR during login:', mockError);
        expect(window.alert).toHaveBeenCalledWith('An unexpected error occurred, login failed');
        expect(goto).not.toHaveBeenCalled();
    });
});