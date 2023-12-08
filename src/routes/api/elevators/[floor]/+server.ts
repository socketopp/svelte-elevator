import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ElevatorState } from '$lib/types';

export const GET: RequestHandler = async ({ fetch, params }) => {
  const targetFloor: number = parseInt(params.floor);

  const response = await fetch('/api/elevators/state');
  const elevatorState: ElevatorState = (await response.json()) as ElevatorState;

  // Filter out elevators with busy === false
  const availableElevators = Object.entries(elevatorState)
    .filter(([, elevator]) => !elevator.busy)
    .map(([id, elevator]) => ({ id, floor: elevator.floor }));

  if (!availableElevators.length) {
    return json({ busy: true });
  }
  // Find the elevator with the floor closest to the target floor
  const closestElevator = availableElevators.reduce((closest, current) =>
    Math.abs(current.floor - targetFloor) < Math.abs(closest.floor - targetFloor)
      ? current
      : closest
  );

  elevatorState[closestElevator.id].busy = true;
  elevatorState[closestElevator.id].targetFloor = targetFloor;
  await fetch('/api/elevators/state', {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      position: elevatorState[closestElevator.id],
      elevatorId: closestElevator.id
    })
  });
  return json({ elevatorToAllocate: closestElevator.id, busy: false });
};
