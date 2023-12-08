import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { ElevatorState, ElevatorData } from '$lib/types';

export const GET: RequestHandler = async ({ locals: { ELEVATOR } }) => {
  const defaultState = {
    e1: { busy: false, floor: 1 },
    e2: { busy: false, floor: 1 },
    e3: { busy: false, floor: 1 },
    e4: { busy: false, floor: 1 },
    e5: { busy: false, floor: 1 }
  };

  const elevatorArray = await Promise.all(
    Object.keys(defaultState).map(async (key) => {
      return { [key]: await ELEVATOR.get(key, 'json') };
    })
  );

  const elevatorState = Object.assign({}, ...elevatorArray);
  return json({ ...elevatorState });
};

export const POST: RequestHandler = async ({ request, locals: { ELEVATOR } }) => {
  const { elevatorPositions } = (await request.json()) as ElevatorState;
  Object.keys(elevatorPositions).forEach(async (elevatorId) => {
    await ELEVATOR.put(elevatorId, JSON.stringify(elevatorPositions[elevatorId]));
  });
  return new Response();
};

export const PATCH: RequestHandler = async ({ request, locals: { ELEVATOR } }) => {
  const { position, elevatorId } = (await request.json()) as ElevatorData;
  await ELEVATOR.put(elevatorId, JSON.stringify(position));
  return new Response();
};
