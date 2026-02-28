<script lang="ts">
  import type { ChatBarArray } from '$lib/interfaces/interfaces';

  export let chats: ChatBarArray = [];
  export let activeChatId: string = '';

  export let onSelect: (id: string) => void = () => {};
  export let onAddChat: () => void = () => {};
</script>

<aside class="chatbar">
  <div class="header">
    <h2>Chats</h2>
    <button class="add-btn" on:click={onAddChat} title="New Chat">
      +
    </button>
  </div>

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