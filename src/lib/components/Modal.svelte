<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { showModal } from '$lib/store';
</script>

{#if $showModal}
	<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

		<div
			class="fixed inset-0 z-10 w-screen overflow-y-auto"
			transition:slide={{ delay: 250, duration: 500, easing: quintOut, axis: 'y' }}
		>
			<div class="flex min-h-full justify-center text-center items-center p-4">
				<div
					class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-sm sm:p-6"
				>
					<div class="w-full flex justify-end">
						<button
							class=""
							on:click={() => {
								$showModal = !$showModal;
							}}
						>
							<svg
								class="hover:cursor-pointer"
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="#000000"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
								><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg
							>
						</button>
					</div>
					<slot />
				</div>
			</div>
		</div>
	</div>
{/if}
