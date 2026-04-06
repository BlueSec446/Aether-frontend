<div class="chat-layout">
  <div class="header"></div>

  <div class="empty-window">
    <div class="empty-state">
      <p>No Chat selected</p>
      <p class="subtext">Select a chat from the sidebar or start a new one.</p>
    </div>
  </div>
</div>

<style>
  .chat-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    /* Flex-grow ensures it takes up the remaining 80% of the screen next to the ChatBar */
    flex-grow: 1; 
  }

  .header {
    background-color: var(--color-secondary);
    display: flex;
    align-items: center;
    height: 40px; /* Matches your ChatBar and ChatWindow header height perfectly */
    border-bottom: 1px solid var(--color-text-dark); /* Adjust if your main header has no border */
  }

  .empty-window {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg-panel);
  }

  .empty-state {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-state p {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color-text-dark);
    font-weight: bold;
  }

  .empty-state .subtext {
    font-size: 0.95rem;
    color: var(--color-text-muted); /* Uses the muted color from your inputs */
    font-weight: normal;
  }
</style>