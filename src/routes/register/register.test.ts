import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { postRegister } from './register';
import { goto } from '$app/navigation';

// Intercept SvelteKit routing
vi.mock('$app/navigation', () => ({
  goto: vi.fn()
}));

describe('Register Controller', () => {
  let consoleErrorMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Inject context bridge facade
    (window as any).frontendAPI = {
      register: vi.fn()
    };

    window.alert = vi.fn();
    consoleErrorMock = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('navigates to /login on successful registration', async () => {
    (window.frontendAPI.register as any).mockResolvedValue({
      status: 'success',
      onion_address: 'onion_vww6yba...'
    });

    await postRegister('NewUser', 'SecurePass123');

    expect(window.frontendAPI.register).toHaveBeenCalledWith('NewUser', 'SecurePass123');
    expect(goto).toHaveBeenCalledWith('/login');
  });

  it('aborts navigation and alerts on backend rejection', async () => {
    (window.frontendAPI.register as any).mockResolvedValue({ status: 'error' });

    await postRegister('TakenUser', 'pass');

    expect(consoleErrorMock).toHaveBeenCalledWith('Registration failed');
    expect(window.alert).toHaveBeenCalledWith('Registration failed');
    expect(goto).not.toHaveBeenCalled();
  });

  it('handles critical network failures gracefully', async () => {
    const mockError = new Error('Connection refused');
    (window.frontendAPI.register as any).mockRejectedValue(mockError);

    await postRegister('TestUser', 'pass');

    expect(consoleErrorMock).toHaveBeenCalledWith('CRITICAL ERROR during registration:', mockError);
    expect(window.alert).toHaveBeenCalledWith(
      'An unexpected error has occurred, registration failed'
    );
    expect(goto).not.toHaveBeenCalled();
  });
});
