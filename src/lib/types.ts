type ElevatorState = {
	[key: string]: {
		busy: boolean;
		floor: number;
		targetFloor?: number | null;
	};
};

interface ElevatorData {
	position: string;
	elevatorId: string;
}
interface FloorResponse {
	busy: boolean;
	elevatorToAllocate: string;
}

export type { ElevatorState, ElevatorData, FloorResponse };
