<script lang="ts">
  import Modal from '$lib/components/Modal.svelte';
  import { showModal } from '$lib/store';
  import type { ElevatorState, FloorResponse } from '$lib/types';
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { expoInOut } from 'svelte/easing';

  const defaultElevatorState = {
    e1: { busy: false, floor: 1, targetFloor: null },
    e2: { busy: false, floor: 1, targetFloor: null },
    e3: { busy: false, floor: 1, targetFloor: null },
    e4: { busy: false, floor: 1, targetFloor: null },
    e5: { busy: false, floor: 1, targetFloor: null }
  };
  let disableUi = false;

  $: {
    if (activeElevators.length < 4) {
      disableUi = false;
    }
  }

  let elevatorPositions: ElevatorState = {};
  let activeElevators: string[] = [];

  function moveElevator(elevatorId: string, targetFloor: number) {
    elevatorPositions[elevatorId].targetFloor = targetFloor;
    elevatorPositions[elevatorId].busy = true;

    const timeToMoveOneFloor = 2000;
    const floorsToMove = Math.abs(targetFloor - elevatorPositions[elevatorId].floor);
    const totalMoveTime = floorsToMove * timeToMoveOneFloor;
    const moveInterval = setInterval(async () => {
      // Move one floor towards the target
      elevatorPositions[elevatorId].floor +=
        targetFloor > elevatorPositions[elevatorId].floor ? 1 : -1;
      // If the elevator has reached the target floor, clear the interval and update the current state in the backend
      if (elevatorPositions[elevatorId].floor === targetFloor) {
        clearInterval(moveInterval);
        elevatorPositions[elevatorId].busy = false;
        elevatorPositions[elevatorId].targetFloor = null;

        await fetch('/api/elevators/state', {
          method: 'PATCH',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ position: elevatorPositions[elevatorId], elevatorId })
        });
        $showModal = false;
        activeElevators = activeElevators.filter((item) => item !== elevatorId);
      }
    }, totalMoveTime / floorsToMove);
  }

  async function requestElevatorToFloor(floor: number) {
    disableUi = true;
    const response = await fetch(`/api/elevators/${floor}`);
    const { elevatorToAllocate, busy } = (await response.json()) as FloorResponse;

    if (busy || activeElevators.length > 4) {
      disableUi = true;
      $showModal = true;
      return;
    }
    $showModal = false;
    disableUi = false;
    activeElevators = [...activeElevators, elevatorToAllocate];
    moveElevator(elevatorToAllocate, floor);
  }

  onMount(async () => {
    await fetch('/api/elevators/state', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ elevatorPositions: defaultElevatorState })
    });
    const response = await fetch('/api/elevators/state');
    const elevatorState = (await response.json()) as ElevatorState;
    elevatorPositions = elevatorState;
  });
</script>

<section class="">
  <div class="flex justify-center gap-2 my-4">
    <a href="/" data-sveltekit-reload>
      <h2 class="text-2xl sm:text-4xl font-semibold text-center font-noir">Hotel Elevators</h2>
    </a>
  </div>
  {#if disableUi}
    Loading..🧝
  {/if}
  <div class="relative bg-slate-700 p-4">
    <div class="bg-blue-950 p-4">
      <div class="flex justify-evenly items-center mb-2">
        <span class="min-w-[4rem] text-white font-noir font-light" />
        {#each Array.from({ length: 5 }, (_, i) => i) as _, index}
          <span class="text-white font-noir font-light"> E:{index + 1}</span>
        {/each}
      </div>

      {#each Array.from({ length: 20 }, (_, i) => 20 - i) as floor}
        <div class="flex justify-evenly items-center mb-2 group">
          <span
            class="min-w-[4rem] text-white font-noir font-light group-hover:bg-yellow-500 px-2 rounded-lg"
            >Floor {floor}</span
          >
          {#each Object.entries(elevatorPositions) as [key, elevator], index}
            {#if elevator?.floor === floor}
              <div
                class:animate-pulse={activeElevators.includes(key)}
                class="w-4 h-4 bg-yellow-500 rounded-full"
              ></div>
            {:else}
              <button on:click={() => requestElevatorToFloor(floor)}>
                <div
                  class="w-4 h-4 bg-gray-300 rounded-full hover:bg-yellow-500 hover:cursor-pointer"
                ></div>
              </button>
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <div class="flex justify-start gap-2 my-4 px-4">
    <h2 class="text-2xl sm:text-4xl font-semibold text-center font-noir min-h-[10rem]">
      Elevator Queue
    </h2>
    <div class="flex flex-col justify-center items-center gap-2">
      {#each activeElevators as active, index (active)}
        <div
          animate:flip={{
            delay: 100,
            duration: 500,
            easing: expoInOut
          }}
        >
          <p class="font-noir bg-blue-900 text-white px-2 rounded-md">
            Elevator {active.split('')[0].toUpperCase()}:{active.split('')[1]} -> {elevatorPositions[
              active
            ]?.targetFloor}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>

<Modal>
  <div class="w-full p-2 flex gap-4 flex-col">
    <h2 class="text-xl sm:text-2xl font-semibold text-center font-noir">Elevator status</h2>
    <p class="text-sm sm:text-lg font-normal text-center font-noir">
      All elevators are currently busy for some reason...🧝
    </p>
    <img alt="elf" src={'https://media.giphy.com/media/l2YWsoDqJPFUkbZuw/giphy.gif'} />
  </div>
</Modal>

<style lang="postcss">
</style>
