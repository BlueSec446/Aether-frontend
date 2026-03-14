<script lang="ts">
    import ChatBar from '$lib/components/ChatBar.svelte';
    import ChatWindow from '$lib/components/ChatWindow.svelte';
    import type { ChatBarArray } from '$lib/interfaces/objects';
    import type { PageData } from './$types';

    // Loaded by the load function in +page.ts
    export let data: PageData;
    let chats: ChatBarArray = data.chats;

    let activeChatId = 1;

    // Reactive statement to find the currently selected chat's name
    $: activeChat = chats.find(c => c.chat_id === activeChatId);
</script>

<main class="desktop-window">
  <div class="app-body">
    <ChatBar 
      chats={chats} 
      {activeChatId} 
      onSelect={(id) => {activeChatId = id}} 
    />

    {#if activeChat}
      {#key activeChatId}
        <ChatWindow 
          chat={activeChat}/>
      {/key}
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

  /* Custom Title Bar from Mockup */
  .title-bar {
    height: 30px;
    background-color: #f3f4f6;
    border-bottom: 2px solid black;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    user-select: none;
    -webkit-app-region: drag; /* Makes it draggable in Electron */
  }

  .app-title {
    font-weight: bold;
    color: var(--color-text-dark);
  }

  .window-controls {
    display: flex;
    gap: 0.5rem;
    -webkit-app-region: no-drag;
  }

  .app-body {
    display: flex;
    flex: 1;
    overflow: hidden; /* Lets the children handle their own scrolling */
  }
</style>