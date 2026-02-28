<script lang="ts">
    import ChatBar from '$lib/components/ChatBar.svelte';
    import ChatWindow from '$lib/components/ChatWindow.svelte';
    import type { ChatBarArray } from '$lib/interfaces/interfaces';
    import type { PageData } from './$types';

    // Loaded by the load function in +page.ts
    export let data: PageData;
    let chats: ChatBarArray = data.chats;

    let activeChatId = "chat_001";

    // Reactive statement to find the currently selected chat's name
    $: activeChat = chats.find(c => c.chatId === activeChatId);
</script>

<main class="desktop-window">
  <header class="title-bar">
    <div class="app-title">Aether</div>
    <div class="window-controls">
    </div>
  </header>

  <div class="app-body">
    <ChatBar 
      chats={chats} 
      {activeChatId} 
      onSelect={(id) => {
        console.log(`Chat clicked. Received id ${id}`)
        activeChatId = id}} 
    />

    {#if activeChat}
      {#key activeChatId}
        <ChatWindow chatId={activeChat.chatId} />
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
    font-family: 'Comic Sans MS', cursive, sans-serif; /* Sketch feel */
  }

  .window-controls {
    display: flex;
    gap: 0.5rem;
    -webkit-app-region: no-drag;
  }

  .window-controls .circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid black;
    background-color: transparent;
  }

  .app-body {
    display: flex;
    flex: 1;
    overflow: hidden; /* Lets the children handle their own scrolling */
  }
</style>