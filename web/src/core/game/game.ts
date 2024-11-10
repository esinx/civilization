import { v4 } from 'uuid'

import {
	$game,
	$player,
	$playerInput,
	Allocation,
	Game,
	GameState,
	Player,
	PlayerInput,
} from './game.state'

export const initializeGame = () =>
	$game.parse({
		id: v4(),
		players: [],
		rounds: [],
		state: GameState.IDLE,
		turn: 0,
	} satisfies Game)

export const createPlayer = (civilizationName: string) =>
	$player.parse({
		id: v4(),
		civilizationName,
		tokens: 40,
	} satisfies Player)

export const createInput = (
	player: Player,
	allocation: Allocation,
	command: string,
) => $playerInput.parse({ player, allocation, command } satisfies PlayerInput)
