<svelte:head>
	<title>Login</title>
</svelte:head>

<script lang="ts">
  import {postLogin} from "./login"

  let username = "";
  let password = "";

  $: isValid = username.length !== 0 && password.length !== 0;
</script>

<div class="auth-container">
  <form class="auth-form">
    
    <div class="form-header">
      <h2>Login</h2>
      <div class="orange-divider"></div>
    </div>

    <div class="form-group">
      <label for="username">Alias</label>
      <input 
        id="username" 
        type="text" 
        bind:value={username} 
        placeholder="johndoe" 
        autocomplete="username" 
      />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input 
        id="password" 
        type="password" 
        bind:value={password} 
        placeholder="******************" 
        autocomplete="current-password" 
      />
    </div>

    <div class="button-container">
      <button 
        disabled={!isValid} 
        on:click|preventDefault={() => postLogin(username, password)}
      >
        Login
      </button>
    </div>

    <div class="link-container">
      <a href="/register">Create an account</a>
    </div>

</form>
</div>

<style>
  /* Centers the form in the absolute middle of the screen */
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--color-bg-main); 
  }

  /* Constrains the form width to match the mockup */
  .auth-form {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem; /* Creates even spacing between all elements */
  }

  /* Header Styling */
  .form-header h2 {
    color: var(--color-text-dark);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  /* The solid orange line under the title */
  .orange-divider {
    height: 2px;
    width: 100%;
    background-color: var(--color-primary);
  }

  /* Input Group Styling */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-group label {
    font-size: 1.2rem;
    color: var(--color-text-dark);
  }

  /* Notice we don't need to style the <input> because your global.css handles it! */

  /* Button & Link Centering */
  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .button-container button {
    width: 140px; /* Gives the button a nice, clickable width */
    font-size: 1.1rem;
  }

  .link-container {
    text-align: center;
  }

  .link-container a {
    color: var(--color-text-muted);
    font-size: 0.85rem;
    text-decoration: none;
    transition: color var(--transition-speed) ease;
  }

  .link-container a:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
</style>