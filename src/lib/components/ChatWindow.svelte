<svelte:head>
	<title>Chat Window</title>
</svelte:head>

<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { Message, Chat } from '$lib/interfaces/objects';
  import{ loadChat, postMessage } from "./chat_window"
  import { messageStore } from '$lib/stores/messages_store';
  import { activeChat } from '$lib/stores/active_chat_store';


  onMount(async () => {
    await loadChat();
  });
  
  let inputText = '';
  let isLoading = false;
  let isMenuOpen = false; // Used to display the menu correctly
  let chatContainer: HTMLElement; // Used for auto-scrolling
  let textAreaElement: HTMLTextAreaElement; // auto-increase of the textbox

  // --- 2. API CALL & LOGIC ---
  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    // Add user message to the UI instantly with no ID
    let newMessage: Message = {id: 0, chat_id: $activeChat.chat_id, sender_contact_id: null, content: inputText, timestamp: new Date().toDateString(), status: "OUTGOING_CREATED"};

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

  function handleChangeAlias() {
    closeMenu();
    console.log("Change Alias clicked");
  }

  function handleExportChat() {
    closeMenu();
    console.log("Export Chat clicked");
  }

  function handleClearChat() {
    closeMenu();
    console.log("Clear Chat clicked");
  }

  function handleDeleteContact() {
    closeMenu();
    console.log("Delete Contact clicked");
  }

  // Functions to resize the height of the textbox
  function autoResize() {
    if (textAreaElement) {
      textAreaElement.style.height = 'auto'; 
      textAreaElement.style.height = textAreaElement.scrollHeight + 'px';
    }
  }
</script>

<div class="chat-layout">
  <div class="header">
    <h3>{$activeChat.title}</h3>

    <div class="menu-container" use:clickOutside={closeMenu}>
      <button class="menu-btn" on:click={toggleMenu} title="Menu">
        &#8942; 
      </button>

      {#if isMenuOpen}
        <div class="dropdown">
          <button on:click={handleChangeAlias}>Change Alias</button>
          <button on:click={handleExportChat}>Export Chat</button>
          <button on:click={handleClearChat}>Clear Chat</button>
          <button class="delete-btn" on:click={handleDeleteContact}>Delete Contact</button>
        </div>
      {/if}
    </div>
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
          <div class="bubble">{msg.content}</div>
            {#if msg.status === "OUTGOING_RECEIVED"}
              <div class="status-symbol">&#10004</div>
            {/if}
            {#if msg.status !== "OUTGOING_RECEIVED"}
              <div class="status-symbol">&#9634</div>
            {/if}
        </div>
      {:else}
        <div class="message contact">
          <div class="bubble">{msg.content}</div>
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
    <img src='./src/lib/assets/Send_Icon.png' alt="Send">
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
    right: 0;    /* Aligns it to the right edge */
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
  }

  .message.user {
    justify-content: flex-end;
  }

  .message.contact {
    justify-content: flex-start;
  }

  .bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: var(--border-radius-lg); /* Replaced 12px */
    line-height: 1.4;
    white-space: pre-wrap; /* Preserves line breaks */
    overflow-wrap: break-word; 
    word-break: break-word;
  }

  .message.user .bubble {
    background-color: var(--color-primary); /* Replaced #fd6541 */
    color: var(--color-text-light); /* Replaced white */
    border-bottom-right-radius: var(--border-radius-sm); /* Replaced 4px */
  }

  .message.contact .bubble {
    background-color: var(--color-secondary); /* Replaced #124050 */
    color: var(--color-text-light); /* Replaced white */
    border-bottom-left-radius: var(--border-radius-sm); /* Replaced 4px */
  }

  .status-symbol {
    color: var(--color-primary);
    font-size: 1.5rem;
    margin-left: 0.5rem;
  }

  .typing {
    font-style: italic;
    opacity: 0.7;
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
    transition: border-color var(--transition-speed) ease, box-shadow var(--transition-speed) ease;
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
    transition: background-color var(--transition-speed) ease, transform var(--transition-speed) ease;
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

  button:disabled, textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>