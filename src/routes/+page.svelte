<script lang="ts">
  /**
   * Root of the frontend
   *
   * Get's called, when starting the app
   * Immediately opens '/login'
   */
  import { goto } from '$app/navigation';
  import { resolve } from '$app/paths';

  goto(resolve('/login'));
</script>
