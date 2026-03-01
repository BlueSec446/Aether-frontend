<svelte:head>
  <title>Register</title>
</svelte:head>

<script lang="ts">
  import { postRegister } from "./register"
   
  let username = "";
  let password = "";
  let confirmPassword = "";

  // Reactively checks that no fields are empty AND the password is strong AND both passwords match
  $: isValid = 
    username.trim().length > 0
    password.length > 0 && 
    password === confirmPassword;
</script>

<div class="auth-container">
  <form class="auth-form">
    
    <div class="form-header">
      <h2>Register</h2>
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
        autocomplete="new-password" 
      />
    </div>

    <div class="form-group">
      <label for="confirm-password">Confirm Password</label>
      <input 
        id="confirm-password" 
        type="password" 
        bind:value={confirmPassword} 
        placeholder="******************" 
        autocomplete="new-password" 
      />
    </div>

    <div class="warning-text">
      <strong>Warning:</strong> <p>Passwords cannot be recovered or reset.</p><p>Please store it safely!</p>
    </div>

    <div class="button-container">
      <button 
        disabled={!isValid} 
        on:click|preventDefault={() => postRegister(username, password)}
      >
        Register
      </button>
    </div>

    <div class="link-container">
      <a href="/login">Already have an account? Login</a>
    </div>

  </form>
</div>

<style>
  .auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--color-bg-main); 
  }

  .auth-form {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem; 
  }

  .form-header h2 {
    color: var(--color-text-dark);
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 0.3rem;
  }

  .orange-divider {
    height: 2px;
    width: 100%;
    background-color: var(--color-primary);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .form-group label {
    font-size: 1.2rem;
    color: var(--color-text-dark);
  }

  .button-container {
    display: flex;
    justify-content: center;
    margin-top: 0.5rem;
  }

  .button-container button {
    width: 140px; 
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