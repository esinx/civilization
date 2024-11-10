import { create } from 'zustand'

import { initializeGame } from '../core/game/game'
import { Game } from '../core/game/game.state'

interface GameStore {
	game: Game
	setGame: (game: Game) => void
}

export const useGame = create<GameStore>()(set => ({
	game: initializeGame(),
	setGame: (game: Game) => set({ game }),
}))
