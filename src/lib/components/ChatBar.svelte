<script lang="ts">
  import { activeChat } from '$lib/stores/active_chat_store';
  import { userStore } from '$lib/stores/user_store';
  import { chatStore } from '$lib/stores/chat_store';
  import { onAddChat } from './chat_bar';

  // User Account Information
  let isAccountModalOpen = false;

  function openAccountInfo(event: MouseEvent) {
    event.stopPropagation();
    isAccountModalOpen = true;
    isModalOpen = false; // Closes the "New Chat" modal if it is open
  }

  function closeAccountInfo() {
    isAccountModalOpen = false;
  }

  // Logic for new Contact Form
  let isModalOpen = false;
  let newAlias = '';
  let newOnion = '';

  function openModal(event: MouseEvent) {
    event.stopPropagation(); // Prevents the clickOutside from instantly triggering
    isModalOpen = true;
    isAccountModalOpen = false;
  }

  function closeModal() {
    isModalOpen = false;
    newAlias = ''; // Clear inputs on close
    newOnion = '';
  }

  function submitNewChat() {
    if (!newAlias.trim() || !newOnion.trim()) return;

    onAddChat(newAlias, newOnion);
    closeModal();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents potential form side-effects
      submitNewChat();
    }
  }

  function clickOutside(node: HTMLElement, callback: () => void) {
    const handleClick = (event: MouseEvent) => {
      if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
        callback();
      }
    };
    document.addEventListener('click', handleClick, true);
    return {
      destroy() {
        document.removeEventListener('click', handleClick, true);
      }
    };
  }
</script>

<aside class="chatbar">
  <div class="header">
    <h2>Chats</h2>
    <div class="header-actions">
      <button class="account" on:click={openAccountInfo} title="Account">
        <img src="./src/lib/assets/user_icon.svg" alt="Account" />
      </button>
      <button class="add-btn" on:click={openModal} title="New Chat"> + </button>
    </div>
  </div>

  {#if isAccountModalOpen}
    <div class="account-info-modal" use:clickOutside={closeAccountInfo}>
      <h3>Account Info</h3>
      <div class="orange-divider"></div>

      <div class="info-group">
        <label for="info-value">My Alias</label>
        <div id="info-value" class="info-value">{$userStore.display_name}</div>
      </div>

      <div class="info-group">
        <label for="onion">My Onion Address</label>
        <div id="onion" class="info-value onion-text">{$userStore.onion_address}</div>
      </div>
    </div>
  {/if}

  {#if isModalOpen}
    <div class="new-chat-modal" use:clickOutside={closeModal}>
      <h3>New Chat</h3>
      <div class="orange-divider"></div>

      <div class="form-group">
        <label for="alias">Alias</label>
        <input
          id="alias"
          bind:value={newAlias}
          on:keydown={handleKeydown}
          placeholder="johndoe"
          autocomplete="off"
        />
      </div>

      <div class="form-group">
        <label for="onion">Onion Address</label>
        <input
          id="onion"
          bind:value={newOnion}
          on:keydown={handleKeydown}
          placeholder="vww6yba..."
          autocomplete="off"
        />
      </div>

      <button class="submit-btn" on:click={submitNewChat}>Chat</button>
    </div>
  {/if}

  <div class="seperation"></div>

  <div class="chat-list">
    {#if $chatStore.length === 0}
      <div class="empty-text">No chats yet.</div>
    {/if}

    {#each $chatStore as chat}
      <button
        class="chat-item"
        class:active={chat.chat_id === $activeChat?.chat_id}
        on:click={() => ($activeChat = chat)}
      >
        <span class="alias">{chat.is_group ? chat.title : chat.display_name}</span>

        {#if chat.last_message && chat.last_message.status === 'INCOMING_UNREAD'}
          <span class="unread-dot"></span>
        {/if}
      </button>
    {/each}
  </div>
</aside>

<style>
  .chatbar {
    position: relative;
    width: 20%;
    display: flex;
    flex-direction: column;
    background-color: var(--color-bg-panel);
    border-right: 2px solid var(--color-text-dark);
    flex-shrink: 0;
    height: 100%;
  }

  .header {
    background-color: var(--color-secondary);
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
  }

  .header-actions {
    display: flex;
    align-items: right;
    gap: 0.8rem;
    margin-right: 1rem;
    height: 100%;
  }

  .account {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .account img {
    height: 60%;
    max-height: 100%;
    width: auto;
    object-fit: contain;
  }

  .add-btn {
    background: transparent;
  }

  .account-info-modal {
    position: absolute;
    top: 50px;
    left: 80%;
    width: 510px;
    color: var(--color-text-dark);
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-text-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .info-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .info-group label {
    font-size: 0.85rem;
    color: var(--color-text-dark);
    margin-bottom: 0.2rem;
  }

  .info-value {
    padding: 0.5rem;
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-text-muted);
    color: var(--color-text-muted);
    background-color: white;
    border-radius: 0;
  }

  .onion-text {
    font-family: monospace;
    font-size: 0.8rem;
    word-break: break-all;
    line-height: 1.4;
  }

  .new-chat-modal {
    position: absolute;
    top: 50px;
    left: 80%;
    width: 380px;
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-text-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    z-index: 100;
    display: flex;
    flex-direction: column;
  }

  .new-chat-modal h3 {
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
    margin-bottom: 0.2rem;
  }

  .form-group input {
    padding: 0.5rem;
    border: 1px solid var(--color-text-muted);
    border-radius: 0;
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
  }

  .seperation {
    height: 1%;
    width: 100%;
    background-color: var(--color-bg-panel);
  }

  .empty-text {
    color: var(--color-secondary);
  }

  .chat-item {
    position: relative;
    width: 100%;
    background-color: var(--color-bg-panel);
    color: var(--color-text-dark);

    border: none;
    border-bottom: 1px solid var(--color-text-dark);
    border-radius: 0;
  }

  .chat-item:hover {
    transform: none;
    filter: brightness(0.9); /* Just slightly darkens it on hover */
  }

  .chat-item.active {
    background-color: var(--color-secondary);
    color: var(--color-text-light);
  }

  .unread-dot {
    width: 12px;
    height: 12px;
    background-color: var(--color-primary);
    border-radius: 50%;

    /* Absolute positioning to pin it to the right side of the button */
    position: absolute;
    right: 1.5rem; /* Keeps it perfectly aligned on the right edge */
    top: 50%;
    transform: translateY(-50%);
  }
</style>
