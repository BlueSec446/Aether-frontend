<script lang="ts">
  /**
   * +page to show register UI and call register logic
   */
  import { resolve } from '$app/paths';
  import { postRegister } from './register';

  let username = '';
  let password = '';
  let confirmPassword = '';
  let isLoading = false;

  // --- PASSWORD POLICY CHECKS ---
  $: hasLength = password.length >= 8;
  $: hasUpper = /[A-Z]/.test(password);
  $: hasLower = /[a-z]/.test(password);
  $: hasNumber = /[0-9]/.test(password);
  $: hasSpecial = /[!@#€§$%^&*(),.?":{}|<>\-_~'`´]/.test(password);

  $: isPasswordStrong = hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  // Reactively checks that no fields are empty AND the password is strong AND both passwords match
  $: isValid =
    username.trim().length > 0 &&
    isPasswordStrong &&
    password.length > 0 &&
    password === confirmPassword;
</script>

<svelte:head>
  <title>Register</title>
</svelte:head>

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

    <ul class="password-hints">
      <li class:met={hasLength}>At least 8 characters</li>
      <li class:met={hasUpper}>One uppercase letter</li>
      <li class:met={hasLower}>One lowercase letter</li>
      <li class:met={hasNumber}>One number</li>
      <li class:met={hasSpecial}>One special character</li>
    </ul>

    <div class="warning-text">
      <strong>Warning:</strong>
      <p>Passwords cannot be recovered or reset.</p>
      <p>Please store it safely!</p>
    </div>

    <div class="button-container">
      <button
        disabled={!isValid && isLoading}
        on:click|preventDefault={() => postRegister(username, password)} // Needs to update isLoading and handle error messages
      >
        Register
      </button>
    </div>

    <div class="link-container">
      <a href={resolve('/login')}>Already have an account? Login</a>
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

  /* Styling for the password hints */
  .password-hints {
    list-style-type: none;
    padding: 0;
    margin: -0.5rem 0 0.5rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .password-hints li {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    transition: color var(--transition-speed) ease;
    display: flex;
    align-items: center;
  }

  /* Adds a tiny empty circle bullet point */
  .password-hints li::before {
    content: '○';
    margin-right: 0.4rem;
    font-size: 0.7rem;
  }

  /* When the requirement is met, it changes color and icon! */
  .password-hints li.met {
    color: var(--color-secondary); /* Uses your Teal color */
    text-decoration: line-through; /* Crosses it off the list */
    text-decoration-color: var(--color-primary);
    text-decoration-thickness: 1.1;
    opacity: 0.8;
  }

  /* Changes the empty circle to a solid dot/checkmark when met */
  .password-hints li.met::before {
    content: '●';
    color: var(--color-primary);
  }

  /* --- Styling for the Warning --- */
  .warning-text {
    font-size: 0.85rem;
    color: var(--color-primary);
    text-align: center;
    margin-top: -0.5rem;
    font-size: 1.1;
    line-height: 1.4;
    padding: 0.5rem;
    border-radius: var(--border-radius-sm);
  }
</style>
