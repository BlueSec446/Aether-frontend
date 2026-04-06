import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/svelte';
import ChatsPage from '../../routes/chats/+page.svelte';
import { loadChats, sync } from '../controllers/chats_wrapper';
import { activeChat, DEFAULT_CHAT } from '$lib/stores/active_chat_store';
import type { Chat } from '$lib/interfaces/objects';

// Mock the backend API wrapper functions
vi.mock('../controllers/chats_wrapper', () => ({
  loadChats: vi.fn(),
  sync: vi.fn().mockResolvedValue('mocked-timestamp')
}));

describe('Chats Main Page (+page.svelte)', () => {
  beforeEach(() => {
    // Provide global API mocks so child components (ChatBar, ChatWindow) don't crash
    (window as any).frontendAPI = {
      getChats: vi.fn(),
      systemStatus: vi.fn(),
      getMessages: vi.fn()
    };

    activeChat.set(DEFAULT_CHAT);
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup(); // Unmounts the Svelte component from the virtual DOM
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('initializes data and starts the polling loop on mount', async () => {
    render(ChatsPage);

    // Validates onMount hooks
    expect(loadChats).toHaveBeenCalledOnce();

    // Fast-forward 25 seconds to trigger the first recursive setTimeout
    await vi.advanceTimersByTimeAsync(25000);

    expect(sync).toHaveBeenCalled();
  });

  it('hides the ChatWindow when no active chat is selected', () => {
    render(ChatsPage);

    // If chat_id is -1, the ChatWindow shouldn't mount, meaning getMessages is never called
    expect(window.frontendAPI.getMessages).not.toHaveBeenCalled();
  });

  it('renders the ChatWindow dynamically when an active chat is selected', async () => {
    activeChat.set({ ...DEFAULT_CHAT, chat_id: 42 } as Chat);

    render(ChatsPage);

    // The ChatWindow mounting triggers getMessages for the active chat ID
    expect(window.frontendAPI.getMessages).toHaveBeenCalledWith(42);
  });

  it('terminates the polling loop when the component is destroyed', async () => {
    const { unmount } = render(ChatsPage);

    // Destroy the component (triggers onDestroy block)
    unmount();

    vi.mocked(sync).mockClear();

    // Fast-forward 25 seconds
    await vi.advanceTimersByTimeAsync(25000);

    // Verifies the timer was cleared and isPolling = false prevented the next loop
    expect(sync).not.toHaveBeenCalled();
  });
});
