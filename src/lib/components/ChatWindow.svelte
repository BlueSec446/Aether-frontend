<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { Message } from '$lib/interfaces/objects';
  import {
    clearChat,
    deleteContact,
    exportContent,
    loadChat,
    postMessage,
    removeMessage,
    updateAlias
  } from './chat_window';
  import { messageStore } from '$lib/stores/messages_store';
  import { activeChat } from '$lib/stores/active_chat_store';

  onMount(async () => {
    await loadChat();
    $messageStore.forEach((msg) => {
      console.log(msg);
    });
  });

  let inputText = '';
  let isLoading = false;
  let isMenuOpen = false; // Used to display the menu correctly
  let isAliasModalOpen = false; // To display change alias modal
  let newAliasInput = '';
  let isExportModalOpen = false;
  let exportPassword = '';
  let includeChatHistory = true;
  let activeMessageMenuId: number | null = null;
  let chatContainer: HTMLElement; // Used for auto-scrolling
  let textAreaElement: HTMLTextAreaElement; // auto-increase of the textbox

  // --- API CALL & LOGIC ---
  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    // Add user message to the UI instantly with no ID
    let newMessage: Message = {
      id: -1,
      chat_id: $activeChat.chat_id,
      sender_contact_id: null,
      content: inputText,
      timestamp: new Date().toISOString(),
      status: 'OUTGOING_CREATED'
    };

    inputText = '';
    if (textAreaElement) {
      // Resize the input box to it's standard size
      textAreaElement.style.height = 'auto';
    }
    await postMessage(newMessage);

    await scrollToBottom();
  }

  // --- 3. HELPER FUNCTIONS ---
  function handleKeydown(event: KeyboardEvent) {
    // Send on Enter (but allow Shift+Enter for new lines)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function scrollToBottom() {
    await tick(); // Wait for Svelte to update the DOM
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  function formatTime(timestamp: string) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // Functions to handle the menu inside of the Header
  function clickOutside(node: HTMLElement, callback: () => void) {
    // Close the menu if the user clicks Outside of the menu
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
        callback();
      }
    };

    // Listen for clicks on the entire document
    document.addEventListener('click', handleClick, true);

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }

  // Functions to change Alias
  function openAliasModal(event: MouseEvent) {
    event.stopPropagation(); // Prevent the clickOutside from instantly firing
    closeMenu();
    isAliasModalOpen = true;
  }

  function closeAliasModal() {
    isAliasModalOpen = false;
    newAliasInput = '';
  }

  function handleAliasKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent accidental newlines or form refreshes
      submitAliasChange();
    }
  }

  async function submitAliasChange() {
    if (!newAliasInput.trim()) return;

    await updateAlias($activeChat.contact_ids[0].contact_id, newAliasInput);
    closeAliasModal();
  }

  // Functions to call Export
  function openExportModal(event: MouseEvent) {
    event.stopPropagation();
    closeMenu();
    isExportModalOpen = true;
  }

  function closeExportModal() {
    isExportModalOpen = false;
    exportPassword = '';
    includeChatHistory = true;
  }

  async function submitExport() {
    if (!exportPassword.trim()) return;

    await exportContent(exportPassword, includeChatHistory);
    closeExportModal();
  }

  function handleExportKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submitExport();
    }
  }

  function toggleMessageMenu(id: number, event: MouseEvent) {
    event.stopPropagation();
    // If clicking the same one, close it; otherwise, open the new one
    activeMessageMenuId = activeMessageMenuId === id ? null : id;
  }

  function closeAllMessageMenus() {
    activeMessageMenuId = null;
  }

  async function handleDeleteMessage(messageId: number) {
    const delMessage = $messageStore.find((m) => m.id === messageId);
    if (delMessage) await removeMessage(delMessage);
    closeAllMessageMenus();
  }

  // Functions to resize the height of the textbox
  function autoResize() {
    if (textAreaElement) {
      textAreaElement.style.height = 'auto';
      textAreaElement.style.height = textAreaElement.scrollHeight + 'px';
    }
  }
</script>

<svelte:head>
  <title>Chat Window</title>
</svelte:head>

<div class="chat-layout">
  <div class="header">
    <h3>{$activeChat.is_group ? $activeChat.title : $activeChat.display_name}</h3>

    <div class="menu-container" use:clickOutside={closeMenu}>
      <button class="menu-btn" on:click={toggleMenu} title="Menu"> &#8942; </button>

      {#if isMenuOpen}
        <div class="dropdown">
          <button on:click={openAliasModal}>Change Alias</button>
          <button on:click={openExportModal}>Export Chat</button>
          <button on:click={clearChat}>Clear Chat</button>
          <button class="delete-btn" on:click={deleteContact}>Delete Contact</button>
        </div>
      {/if}
    </div>

    {#if isAliasModalOpen}
      <div class="alias-modal" use:clickOutside={closeAliasModal}>
        <h3>Change Alias</h3>
        <div class="orange-divider"></div>

        <div class="form-group">
          <label for="new-alias">New Alias</label>
          <input
            id="new-alias"
            bind:value={newAliasInput}
            on:keydown={handleAliasKeydown}
            placeholder="Enter new name..."
            autocomplete="off"
          />
        </div>

        <button class="submit-btn" on:click={submitAliasChange}>Save</button>
      </div>
    {/if}

    {#if isExportModalOpen}
      <div class="alias-modal" use:clickOutside={closeExportModal}>
        <h3>Export Chat</h3>
        <div class="orange-divider"></div>

        <div class="form-group">
          <label for="export-pw">Encryption Password</label>
          <input
            id="export-pw"
            type="password"
            bind:value={exportPassword}
            on:keydown={handleExportKeydown}
            placeholder="Min. 8 characters..."
            autocomplete="new-password"
          />
        </div>

        <div class="checkbox-group">
          <input id="include-chats" type="checkbox" bind:checked={includeChatHistory} />
          <label for="include-chats">Include message history</label>
        </div>

        <button class="submit-btn" on:click={submitExport}>Export</button>
      </div>
    {/if}
  </div>

  <div class="chat-window" bind:this={chatContainer}>
    {#if $messageStore.length === 0}
      <div class="empty-state">
        <p>This is a new Chat.</p>
        <p>Send a message to start this chat!</p>
      </div>
    {/if}

    {#each $messageStore as msg}
      {#if msg.sender_contact_id === null}
        <div class="message user">
          <div class="bubble-wrapper" use:clickOutside={closeAllMessageMenus}>
            <div class="bubble">
              {msg.content}
              <button class="msg-menu-btn" on:click={(e) => toggleMessageMenu(msg.id, e)}>
                ▾
              </button>

              {#if activeMessageMenuId === msg.id}
                <div class="msg-dropdown">
                  <button on:click={() => handleDeleteMessage(msg.id)}>Delete</button>
                </div>
              {/if}
              <div class="message-time">{formatTime(msg.timestamp)}</div>
            </div>
            {#if msg.status === 'OUTGOING_RECEIVED'}
              <div class="status-symbol">&#10004;</div>
            {/if}
            {#if msg.status !== 'OUTGOING_RECEIVED'}
              <div class="status-symbol">&#9634;</div>
            {/if}
          </div>
        </div>
      {:else}
        <div class="message contact">
          <div class="bubble">
            {msg.content}
            <button class="msg-menu-btn" on:click={(e) => toggleMessageMenu(msg.id, e)}> ▾ </button>

            {#if activeMessageMenuId === msg.id}
              <div class="msg-dropdown">
                <button on:click={() => handleDeleteMessage(msg.id)}>Delete</button>
              </div>
            {/if}
            <div class="message-time">{formatTime(msg.timestamp)}</div>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <div class="input-area">
    <textarea
      bind:this={textAreaElement}
      bind:value={inputText}
      on:keydown={handleKeydown}
      on:input={autoResize}
      placeholder="Type your message..."
      rows="1"
      disabled={isLoading}
    ></textarea>
    <button class="send-button" on:click={sendMessage} disabled={isLoading || !inputText.trim()}>
      <img src="./src/lib/assets/Send_Icon.png" alt="Send" />
    </button>
  </div>
</div>

<style>
  .chat-layout {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    margin: 0 auto;
    background-color: var(--color-bg-main);
    font-family: sans-serif;
  }

  .chat-window {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* Header Layout */
  .header {
    background-color: var(--color-secondary);
    color: var(--color-text-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    height: 40px;
  }

  .header h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: normal;
  }

  /* Menu Container & Button */
  .menu-container {
    position: relative; /* Crucial: anchors the absolute dropdown to this div */
  }

  .menu-btn {
    background: transparent;
    color: var(--color-text-light);
    border: none;
    font-size: 1.5rem;
    padding: 0 0.5rem;
    line-height: 1;
    cursor: pointer;
  }

  button.menu-btn:hover:not(:disabled) {
    background-color: var(--color-secondary); /* Overrides global orange hover */
    transform: none;
    opacity: 0.7;
  }

  /* The Dropdown Box */
  .dropdown {
    position: absolute;
    top: 100%; /* Positions it right below the 3-dot button */
    right: 0; /* Aligns it to the right edge */
    background-color: var(--color-bg-panel); /* Light grey from mockup */
    border: 1px solid var(--color-text-dark);
    display: flex;
    flex-direction: column;
    min-width: 145px;
    z-index: 50; /* Ensures it sits on top of the chat messages */
  }

  /* Dropdown Items */
  .dropdown button {
    background: transparent;
    color: var(--color-text-dark);
    border-radius: 0;
    border-bottom: 1px solid var(--color-text-dark);
    padding: 0.5rem 1rem;
    text-align: center;
    font-weight: normal;
    font-size: 0.9rem;
  }

  .dropdown button:last-child {
    border-bottom: none; /* Removes the line under the last item */
  }

  .dropdown button:hover {
    background-color: #d1d5db; /* Slightly darker grey for hover state */
    transform: none; /* Overrides global scale effect */
  }

  /* Specific styling for the Delete button to match the mockup */
  .dropdown .delete-btn {
    color: var(--color-primary);
    font-weight: bold;
  }

  .dropdown .delete-btn:hover {
    color: white;
  }

  /* Alias Modal Styling */
  .alias-modal {
    position: absolute;
    top: 50px;
    right: 1.5rem; /* Anchors it cleanly to the right side under the menu */
    width: 320px;
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-text-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .alias-modal h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-text-dark);
    font-weight: normal;
  }

  .orange-divider {
    height: 2px;
    background-color: var(--color-primary);
    margin: 0.5rem 0 1rem 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .form-group label {
    font-size: 0.85rem;
    color: var(--color-text-dark);
    margin-bottom: 0.4rem;
  }

  .form-group input {
    padding: 0.5rem;
    border: 1px solid var(--color-text-muted);
    border-radius: 0;
    font-family: inherit;
    color: var(--color-text-dark);
    background-color: var(--color-bg-white);
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .submit-btn {
    align-self: flex-start;
    background-color: var(--color-primary);
    color: var(--color-text-light);
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: var(--border-radius-sm);
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 0.5rem;
    transition: transform var(--transition-speed) ease;
  }

  /* Checkbox specific styling to fit the modal theme */
  .checkbox-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
  }

  .checkbox-group input {
    cursor: pointer;
    width: 16px;
    height: 16px;
    accent-color: var(--color-primary);
  }

  .checkbox-group label {
    font-size: 0.85rem;
    color: var(--color-text-dark);
    cursor: pointer;
    user-select: none;
  }

  /* Ensure inputs in modals have consistent widths */
  .form-group input {
    width: 100%;
    box-sizing: border-box;
  }

  .empty-state {
    text-align: center;
    color: var(--color-text-light); /* Replaced white */
    margin-top: auto;
    margin-bottom: auto;
  }

  .message {
    display: flex;
    width: 100%;
    align-items: flex-end;
    margin-bottom: 0.5rem; /* Space between bubbles */
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.contact {
    justify-content: flex-start;
  }

  /* NEW: Anchor for the dropdown and status symbols */
  .bubble-wrapper {
    position: relative;
    display: flex;
    align-items: flex-end;
    max-width: 70%; /* Match your bubble's max-width */
  }

  .message.user .bubble-wrapper {
    flex-direction: row; /* Bubble then Status */
  }

  .message.contact .bubble-wrapper {
    flex-direction: row-reverse; /* Status then Bubble (if status exists for contact) */
  }

  .bubble {
    position: relative; /* Required for msg-menu-btn positioning */
    padding: 0.75rem 1rem;
    padding-right: 1.8rem; /* Extra space so text doesn't overlap the ▾ button */
    border-radius: var(--border-radius-lg);
    line-height: 1.4;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .message.user .bubble {
    background-color: var(--color-primary);
    color: var(--color-text-light);
    border-bottom-right-radius: var(--border-radius-sm);
  }

  .message.contact .bubble {
    background-color: var(--color-secondary);
    color: var(--color-text-light);
    border-bottom-left-radius: var(--border-radius-sm);
  }

  /* --- Message Menu Elements --- */

  .msg-menu-btn {
    position: absolute;
    top: 6px;
    right: 8px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    color: inherit; /* Matches the bubble text color automatically */
    opacity: 0;
    transition: opacity 0.2s;
    padding: 2px 4px;
    line-height: 1;
  }

  .bubble:hover .msg-menu-btn {
    opacity: 0.7;
  }

  .msg-dropdown {
    position: absolute;
    top: 25px;
    right: 5px;
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-text-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 100;
    border-radius: var(--border-radius-sm);
    min-width: 100px;
    overflow: hidden;
  }

  .msg-dropdown button {
    display: block;
    width: 100%;
    padding: 0.6rem 1rem;
    border: none;
    background: transparent;
    color: var(--color-primary);
    font-size: 0.85rem;
    cursor: pointer;
    text-align: left;
  }

  .msg-dropdown button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .status-symbol {
    margin-left: 6px;
    margin-right: 6px;
    font-size: 0.8rem;
    color: var(--color-primary);
    flex-shrink: 0;
    padding-bottom: 2px; /* Align with bottom of bubble */
  }

  .status-symbol {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin-left: 0.5rem;
  }

  .input-area {
    display: flex;
    padding: 1rem;
    background: var(--color-bg-main);
    border-top: 1px solid var(--color-bg-main);
    align-items: flex-end;
    gap: 0.5rem;
  }

  textarea {
    flex: 1;
    resize: none;
    padding: 0.75rem;
    border: 1px solid var(--color-text-muted); /* Matched the global.css input border */
    border-radius: var(--border-radius-md);
    background-color: var(--color-bg-white);
    color: var(--color-text-dark);
    font-family: inherit;
    outline: none;
    transition:
      border-color var(--transition-speed) ease,
      box-shadow var(--transition-speed) ease;
    min-height: 44px;
    max-height: 150px;
    overflow-y: auto;
  }

  textarea:focus {
    border-color: var(--color-primary); /* Replaced #fd6541 */
    box-shadow: 0 0 0 2px rgba(253, 101, 65, 0.2); /* Soft orange glow from global.css */
  }

  .send-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--color-primary); /* Replaced #fd6541 */
    height: 44px;
    width: 44px;
    border: none;
    border-radius: 10%;
    font-weight: bold;
    cursor: pointer;
    transition:
      background-color var(--transition-speed) ease,
      transform var(--transition-speed) ease;
  }

  .send-button img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  button:hover:not(:disabled) {
    background-color: var(--color-primary); /* Replaced #fd6541 */
    transform: scale(1.05);
    filter: brightness(1.1); /* Applied the global button hover effect */
  }

  button:disabled,
  textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
