<svelte:head>
	<title>Chat Window</title>
</svelte:head>

<script lang="ts">
  import { tick } from 'svelte';

  // --- 1. STATE MANAGEMENT ---
  interface Message {
    sender: 'user' | 'contact';
    content: string;
    timestamp: Date;
  }

  let messages: Message[] = [];
  let inputText = '';
  let isLoading = false;
  let chatContainer: HTMLElement; // Used for auto-scrolling

  // --- 2. API CALL & LOGIC ---
  async function sendMessage() {
    if (!inputText.trim() || isLoading) return;

    // Add user message to the UI instantly
    const userMessage = inputText;
    messages = [...messages, { sender: 'user', content: userMessage, timestamp: new Date() }];
    inputText = ''; 
    console.log(messages.pop()?.timestamp)
    
    await scrollToBottom();

    try {
      // The API Call to your Backend (e.g., your Python sidecar on port 8000)
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) throw new Error('API request failed');
      
    } catch (error) {
      console.error('Error fetching data:', error);
      
    } finally {
      await scrollToBottom();
    }
  }

  function receiveMessage() {
    //const data = await response.json();

      // Append the contact's response
     // messages = [...messages, { role: 'contact', content: data.reply, timestamp: data.timestamp}];

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
</script>

<div class="chat-layout">
  <div class="chat-window" bind:this={chatContainer}>
    {#if messages.length === 0}
      <div class="empty-state">
        <p>This is a new Chat.</p>
        <p>Send a message to start this chat!</p>
      </div>
    {/if}

    {#each messages as msg}
      <div class="message {msg.sender}">
        <div class="bubble">{msg.content}</div>
      </div>
    {/each}

</div>
<div class="input-area">
    <textarea 
    bind:value={inputText} 
    on:keydown={handleKeydown}
    placeholder="Type your message..."
    rows="2"
    disabled={isLoading}
    ></textarea>
    <button on:click={sendMessage} disabled={isLoading || !inputText.trim()}>
    <img src="/icons/Send_Icon.png" alt="Send">
    </button>
</div>
 

 
</div>

<style>
  .chat-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 800px;
    margin: 0 auto;
    background-color: #666666;
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

  .empty-state {
    text-align: center;
    color: white;
    margin-top: auto;
    margin-bottom: auto;
  }

  .message {
    display: flex;
    width: 100%;
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
    border-radius: 12px;
    line-height: 1.4;
    white-space: pre-wrap; /* Preserves line breaks */
  }

  .message.user .bubble {
    background-color: #fd6541;
    color: white;
    border-bottom-right-radius: 4px;
  }

  .message.contact .bubble {
    background-color: #124050;
    color: white;
    border-bottom-left-radius: 4px;
  }

  .typing {
    font-style: italic;
    opacity: 0.7;
  }

  .input-area {
    display: flex;
    padding: 1rem;
    background: #666666;
    border-top: 1px solid #666666;
    gap: 0.5rem;
    align-items: flex-end;
  }

  textarea {
    flex: 1;
    resize: none;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-family: inherit;
    outline: none;
    
  }

  textarea:focus {
    border-color: #fd6541;
  }

  button {
    padding: 0.5;
    background-color: #fd6541;
    color: white;
    height: auto;
    border: none;
    border-radius: 10%;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button img {
    width: auto;
    height: 50px;
    object-fit: contain;
  }

  button:hover:not(:disabled) {
    background-color: #fd6541;
    transform: scale(1.05);
  }

  button:disabled, textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>