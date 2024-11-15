import { create } from 'zustand'

import { createPlayer, initializeGame } from '../core/game/game'
import { Game } from '../core/game/game.state'
import { addPlayer } from '../core/game/reducers'

interface GameStore {
	game: Game
	setGame: (game: Game) => void
}

const addUsers = (game: Game, names: string[]) =>
	names.reduce((acc, name) => addPlayer(acc, createPlayer(name)), game)

export const useGame = create<GameStore>()(set => ({
	game: addUsers(initializeGame(), []),
	setGame: (game: Game) => set({ game }),
}))
