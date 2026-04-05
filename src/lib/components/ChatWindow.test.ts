import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/svelte';
import ChatWindow from './ChatWindow.svelte';
import { activeChat, DEFAULT_CHAT } from '$lib/stores/active_chat_store';
import { messageStore } from '$lib/stores/messages_store';
import { loadChat, postMessage, deleteContact } from './chat_window';
import type { Message, Chat } from '$lib/interfaces/objects';

// Intercept chat_window logic to prevent actual API calls during UI testing
vi.mock('./chat_window', () => ({
  loadChat: vi.fn(),
  postMessage: vi.fn(),
  clearChat: vi.fn(),
  deleteContact: vi.fn()
}));

describe('ChatWindow Component', () => {
  const mockChat: Chat = {
    ...DEFAULT_CHAT,
    chat_id: 1,
    title: 'Alice Group',
    display_name: 'Alice',
    is_group: 0
  };

  beforeEach(() => {
    // Reset stores to a known state before each test
    activeChat.set(mockChat);
    messageStore.reset();

    // Mock scrollIntoView/scroll behavior since JSDOM doesn't support layout rendering
    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('loads chat data on mount and displays the correct header', () => {
    render(ChatWindow);

    // Validates lifecycle hook and reactive header
    expect(loadChat).toHaveBeenCalledOnce();
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('displays the empty state when the message store is empty', () => {
    render(ChatWindow);

    expect(screen.getByText('This is a new Chat.')).toBeTruthy();
    expect(screen.getByText('Send a message to start this chat!')).toBeTruthy();
  });

  it('renders incoming and outgoing messages correctly', () => {
    const mockMessages: Message[] = [
      {
        id: 1,
        chat_id: 1,
        sender_contact_id: null,
        content: 'Hello from me',
        timestamp: '2023-01-01T10:00:00Z',
        status: 'OUTGOING_RECEIVED'
      },
      {
        id: 2,
        chat_id: 1,
        sender_contact_id: 99,
        content: 'Hello from contact',
        timestamp: '2023-01-01T10:01:00Z',
        status: 'INCOMING_READ'
      }
    ];
    messageStore.setMessages(mockMessages);

    render(ChatWindow);

    // Ensure both bubbles rendered
    expect(screen.getByText('Hello from me')).toBeTruthy();
    expect(screen.getByText('Hello from contact')).toBeTruthy();

    // Ensure the empty state is hidden
    expect(screen.queryByText('This is a new Chat.')).toBeNull();
  });

  it('sends a message when clicking the send button and clears the input', async () => {
    render(ChatWindow);

    const input = screen.getByPlaceholderText('Type your message...') as HTMLTextAreaElement;
    const sendBtn = screen.getByRole('button', { name: /send/i }); // Matches the alt text of the image

    // Simulate typing
    await fireEvent.input(input, { target: { value: 'This is a test message' } });
    expect(input.value).toBe('This is a test message');

    // Simulate sending
    await fireEvent.click(sendBtn);

    // Verify postMessage was called with the correct temporary object
    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        id: -1,
        chat_id: 1,
        content: 'This is a test message',
        status: 'OUTGOING_CREATED'
      })
    );

    // Verify the input box was cleared after sending
    expect(input.value).toBe('');
  });

  it('sends a message when pressing Enter (without Shift)', async () => {
    render(ChatWindow);

    const input = screen.getByPlaceholderText('Type your message...');

    await fireEvent.input(input, { target: { value: 'Enter key test' } });

    // Simulate pressing Enter
    await fireEvent.keyDown(input, { key: 'Enter', shiftKey: false });

    expect(postMessage).toHaveBeenCalledOnce();
  });

  it('allows multiline input when pressing Shift+Enter without sending', async () => {
    render(ChatWindow);

    const input = screen.getByPlaceholderText('Type your message...');

    await fireEvent.input(input, { target: { value: 'Line 1' } });

    // Simulate pressing Shift+Enter
    await fireEvent.keyDown(input, { key: 'Enter', shiftKey: true });

    // postMessage should NOT be called
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('opens and interacts with the dropdown menu', async () => {
    render(ChatWindow);

    // Menu should be closed initially
    expect(screen.queryByText('Clear Chat')).toBeNull();

    // Click the 3-dot menu button (using the title attribute)
    const menuBtn = screen.getByTitle('Menu');
    await fireEvent.click(menuBtn);

    // Menu should now be open
    const clearBtn = screen.getByText('Clear Chat');
    const deleteBtn = screen.getByText('Delete Contact');
    expect(clearBtn).toBeTruthy();

    // Click an action inside the menu
    await fireEvent.click(deleteBtn);

    // Verify the correct controller function was triggered
    expect(deleteContact).toHaveBeenCalledOnce();
  });
});
