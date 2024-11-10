import { z } from 'zod'

export enum Allocatable {
	SRD = 'Science Research and Development',
	MD = 'Military and Defense',
	EWT = 'Education and Workforce Training',
	IPW = 'Infrastructure and Public Works',
	ESR = 'Environmental Sustainability and Resources',
	HPS = 'Healthcare and Public Safety',
	TD = 'Trade and Diplomacy',
	ACNI = 'Arts and Culture',
}

export const $allocatable = z.nativeEnum(Allocatable)
export const $allocation = z.record($allocatable, z.number().gte(0))

export const $player = z.object({
	id: z.string(),
	civilizationName: z.string(),
	tokens: z.number(),
})

export const $playerInput = z
	.object({
		player: $player,
		allocation: $allocation,
		command: z.string(),
	})
	.refine(
		input => {
			const total = Object.values(input.allocation).reduce(
				(acc, cur) => acc + cur,
				0,
			)
			return total === input.player.tokens
		},
		{
			message: 'Allocation must sum to the number of tokens',
			path: ['allocation'],
		},
	)

export const $playerOutput = z.object({
	id: z.string(),
	civilizationName: z.string(),
	tokens: z.number(),
	events: z.array(z.string()),
})

export const $turnOutput = z.object({
	players: z.array($player),
	inputs: z.array($playerInput),
	outputs: z.array($playerOutput),
})

export enum GameState {
	IDLE = 'IDLE',
	PENDING_TURN = 'PENDING_TURN',
	PENDING_EVENTS = 'PENDING_EVENTS',
	COMPLETE = 'COMPLETE',
	ERROR = 'ERROR',
}

export const $gameState = z.nativeEnum(GameState)

export const $game = z.object({
	id: z.string(),
	players: z.array($player),
	turn: z.number().gte(0),
	rounds: z.array($turnOutput),
	state: $gameState,
})

export type Allocation = z.infer<typeof $allocation>
export type Player = z.infer<typeof $player>
export type PlayerInput = z.infer<typeof $playerInput>
export type PlayerOutput = z.infer<typeof $playerOutput>
export type TurnOutput = z.infer<typeof $turnOutput>
export type Game = z.infer<typeof $game>
