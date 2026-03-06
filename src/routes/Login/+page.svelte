<svelte:head>
	<title>Login</title>
</svelte:head>

<script lang="ts">
  import {post_login} from "./login"

  let username = "";
  let password = "";

  $: isValid = username.length !== 0 && password.length !== 0;
</script>

<form>
  <h1>Login</h1>

  <input type="user" name="user" bind:value={username}/>

  <input type="password" name="password" bind:value={password}/>

  <button disabled={!isValid} on:click={() => post_login(username, password)}>Login</button>

  <a href="/register">Register</a>

  <a href="/chats">Chats</a>
</form>