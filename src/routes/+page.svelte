<script lang="ts">
	import '../app.postcss';
	import { useChat } from 'ai/svelte';
	import { marked } from 'marked';

	const { input, handleSubmit, messages } = useChat();
</script>

<main class="max-w-[70vw] mx-auto flex flex-col justify-between h-screen p-16 gap-4">
	<h1 class="h1 mb-4 select-none">Your chat:</h1>
	<div class="overflow-auto">
		<ul class="flex flex-col gap-8">
			{#each $messages as msg}
				<li class="flex flex-col">
					<p class="font-medium mb-2">{msg.role} on {msg.createdAt?.toDateString()}:</p>
					<p class="prose prose-code:text-white text-white">{@html marked(msg.content)}</p>
				</li>
			{/each}
		</ul>
	</div>
	<form on:submit={handleSubmit} class="flex gap-4">
		<input placeholder="Your query" class="input p-2" bind:value={$input} />
		<button class="btn variant-ghost-primary" type="submit">Send</button>
	</form>
</main>
