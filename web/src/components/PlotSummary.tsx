import { useGame } from '../store/game'

import { Card } from './ui/card'

const RoundSummary = (round: any) => {
	return
}
export const PlotSummary = () => {
	const { game } = useGame()

	return (
		<Card>
			<div>{JSON.stringify(game.rounds.reverse())}</div>
		</Card>
	)
}
