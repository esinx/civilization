/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, test } from 'vitest'

import { createInput, createPlayer, initializeGame } from '../game'
import { Allocatable, GameState } from '../game.state'
import { addPlayer, canStartGame, executeTurn } from '../reducers'

test(
	'Test run',
	async () => {
		let game = initializeGame()
		game = addPlayer(game, createPlayer('Joytopia'))
		game = addPlayer(game, createPlayer('Eunsoonia'))
		expect(canStartGame(game)).toBeTruthy()
		game = { ...game, state: GameState.PENDING_TURN }
		const inputs = [
			createInput(
				game.players.find(p => p.civilizationName === 'Joytopia')!,
				{ [Allocatable.MD]: 20, [Allocatable.SRD]: 15, [Allocatable.EWT]: 5 },
				'Attack Eunsoonia',
			),
			createInput(
				game.players.find(p => p.civilizationName === 'Eunsoonia')!,
				{ [Allocatable.MD]: 10, [Allocatable.SRD]: 15, [Allocatable.EWT]: 15 },
				'Attack Joytopia',
			),
		]
		game = { ...game, state: GameState.PENDING_EVENTS }
		const { game: newGame, output } = await executeTurn(game, inputs)
		game = newGame
		expect(newGame.state).toBe(GameState.PENDING_TURN)
		expect(output).toBeDefined()
		console.log(output)
	},
	{
		timeout: 500000,
	},
)
