<script lang="ts">
  import type { ChatBarArray } from '$lib/interfaces/interfaces';

  export let chats: ChatBarArray = [];
  export let activeChatId: string = '';

  export let onSelect: (id: string) => void = () => {};
  export let onAddChat: (alias: string, onion: string) => void = () => {};

  // Logic for new Contact Form
  let isModalOpen = false;
  let newAlias = '';
  let newOnion = '';

  function openModal(event: MouseEvent) {
    event.stopPropagation(); // Prevents the clickOutside from instantly triggering
    isModalOpen = true;
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
    <button class="add-btn" on:click={openModal} title="New Chat">
      +
    </button>
  </div>

  {#if isModalOpen}
    <div class="new-chat-modal" use:clickOutside={closeModal}>
      <h3>New Chat</h3>
      <div class="orange-divider"></div>
    
      <div class="form-group">
        <label for="alias">Alias</label>
        <input id="alias" bind:value={newAlias} placeholder="johndoe" autocomplete="off" />
      </div>

      <div class="form-group">
        <label for="onion">Onion Address</label>
        <input id="onion" bind:value={newOnion} placeholder="vww6yba..." autocomplete="off" />
      </div>

      <button class="submit-btn" on:click={submitNewChat}>Chat</button>
    </div>
  {/if}

  <div class="seperation"></div>
  
  <div class="chat-list">
    {#if chats.length === 0}
      <div class="empty-text">No chats yet.</div>
    {/if}

    {#each chats as chat}
      <button 
        class="chat-item" 
        class:active={chat.chatId === activeChatId}
        on:click={() => onSelect(chat.chatId)} >
        <span class="alias">{chat.alias}</span>
        
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

  .add-btn {
    background: transparent;
  }

  .new-chat-modal {
    position: absolute;
    top: 50px; /* Aligns perfectly right under the header */
    left: 80%; /* Pushes it out over the chat window */
    width: 380px;
    background-color: var(--color-bg-panel);
    border: 1px solid var(--color-text-dark);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    padding: 1.5rem;
    z-index: 100; /* Ensures it floats above everything */
    display: flex;
    flex-direction: column;
  }

  .new-chat-modal h3 {
    margin: 0;
    font-size: 1.1rem;
    color: var(--color-text-dark);
    font-weight: normal;
  }

  /* The orange line from the mockup */
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
    border-radius: 0; /* Match the flat, sharp look in the mockup */
  }

  .submit-btn {
    align-self: flex-start; /* Aligns the button to the left */
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

  .chat-item {
    width: 100%;
    background-color: var(--color-bg-panel);
    color: var(--color-text-dark);

    border: none;
    border-bottom: 1px solid var(--color-text-dark);
    border-radius: 0;
  }

  .chat-item:hover {
    transform: none; 
    filter: brightness(0.90); /* Just slightly darkens it on hover */
  }
  
  .chat-item.active {
    background-color: var(--color-secondary); 
    color: var(--color-text-light);
  }
</style>