import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import { openAI } from '../openai'

import {
	$playerOutput,
	Game,
	GameState,
	Player,
	PlayerInput,
	TurnOutput,
} from './game.state'
import { GAME_SETTING_PROMPT } from './prompt'

export const addPlayer = (game: Game, player: Player): Game => ({
	...game,
	players: [...game.players, player],
})

export const removePlayer = (game: Game, playerId: string): Game => ({
	...game,
	players: game.players.filter(p => p.id !== playerId),
})

export const canStartGame = (game: Game): boolean => game.players.length >= 2

export const startGame = (game: Game): Game => ({
	...game,
	state: GameState.PENDING_TURN,
})

/// Execute Turn, modifying game state and updating most recent turn output
export const executeTurn = async (
	game: Game,
	inputs: PlayerInput[],
): Promise<{
	game: Game
	output: TurnOutput // TODO: maybe optional
}> => {
	const completion = await openAI.client.beta.chat.completions.parse({
		model: 'gpt-4o-2024-08-06',
		messages: [
			{
				role: 'system',
				content: GAME_SETTING_PROMPT,
			},
			{
				role: 'system',
				content: `The current game state is as follows ${JSON.stringify(game)}`,
			},
			{
				role: 'system',
				content: `This year, we have the following user inputs: ${JSON.stringify(
					inputs,
				)}`,
			},
			{
				role: 'user',
				content:
					"Given this year's user inputs and past game history, output the resulting tokens and events that would occur",
			},
		],
		response_format: zodResponseFormat(
			z.object({
				outputs: z.array($playerOutput),
			}),
			'PlayerOutput',
		),
	})

	const outputs = completion.choices[0]?.message.parsed?.outputs
	if (!outputs) {
		console.log(completion.choices[0]?.message.refusal)
		return {
			game: {
				...game,
				state: GameState.ERROR,
			},
			output: {
				players: game.players,
				inputs,
				outputs: [],
			},
		}
	}
	const turnOutput = {
		players: game.players,
		inputs,
		outputs,
	}
	return {
		game: {
			...game,
			turn: game.turn + 1,
			rounds: [...game.rounds, turnOutput],
			state: GameState.PENDING_TURN,
			players: game.players.map(player => {
				const output = outputs.find(o => o.id === player.id)
				if (!output) {
					return player
				}
				return {
					...player,
					tokens: output.tokens,
					events: output.events,
				}
			}),
		},
		output: turnOutput,
	}
}
