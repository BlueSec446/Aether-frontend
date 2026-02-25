<svelte:head>
	<title>Login</title>
</svelte:head>

<script lang="ts">
  import {post_login} from "./+page"

  let username = "";
  let password = "";
</script>

<form>
  <h1>Login</h1>

  <input type="user" name="user" value={username}/>

  <input type="password" name="password" value={password}/>

  <button on:click={post_login(username, password)}>Login</button>
</form>

