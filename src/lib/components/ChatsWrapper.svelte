<script lang="ts">
  import ChatBar from '$lib/components/ChatBar.svelte';
  import ChatWindow from '$lib/components/ChatWindow.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { loadChats, sync } from './chats_wrapper';
  import { activeChat } from '$lib/stores/active_chat_store';
    import EmptyChatWindow from './EmptyChatWindow.svelte';

  let pollingTimer: ReturnType<typeof setTimeout>;
  let isPolling = false;
  let isMounted = false;
  let lastSyncTime = Date.now().toString();

  async function pollForMessages() {
    if (!isPolling) return;

    lastSyncTime = await sync(lastSyncTime);

    if (isPolling) {
      pollingTimer = setTimeout(pollForMessages, 25000);
    }
  }

  onMount(async () => {
    isMounted = true;
    await loadChats();

    if (!isMounted) return;

    isPolling = true;
    pollForMessages();
  });

  onDestroy(() => {
    isMounted = false;
    isPolling = false;
    clearTimeout(pollingTimer);
  });
</script>

<main class="desktop-window">
  <div class="app-body">
    <ChatBar />

    {#if $activeChat.chat_id !== -1}
      {#key $activeChat}
        <ChatWindow />
      {/key}
    {:else}
      <EmptyChatWindow />
    {/if}
  </div>
</main>

<style>
  /* Reset global margin so the app fills the window */
  :global(body, html) {
    margin: 0;
    padding: 0;
    height: 100vh;
    font-family: sans-serif;
    overflow: hidden; /* Prevents whole-page scrolling */
  }

  .desktop-window {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    border: 2px solid #9ca3af; /* Outer stroke from sketch */
    box-sizing: border-box;
  }

  .app-body {
    display: flex;
    flex: 1;
    overflow: hidden; /* Lets the children handle their own scrolling */
  }
</style>
