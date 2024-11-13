import { PlayerOutput, TurnOutput } from '../core/game/game.state'
import { cn } from '../lib/utils'
import { useGame } from '../store/game'
import { hashToIcon } from '../util'

import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'

const PlayerSummary: React.FC<{ playerOutput: PlayerOutput }> = ({
	playerOutput,
}) => {
	return (
		<div className={cn('p-4')}>
			<ul className={cn('list', 'list-disc')}>
				{playerOutput.events.map(event => (
					<li className={cn('list-item', 'mb-4')}>{event}</li>
				))}
			</ul>
		</div>
	)
}

const RoundSummary: React.FC<{
	turnOutput: TurnOutput
}> = ({ turnOutput }) => {
	return (
		<Tabs>
			<TabsList
				className={cn(
					'overflow-auto',
					'max-w-[100%]',
					'h-auto',
					'sticky',
					'top-0',
				)}
			>
				{turnOutput.outputs.map(playerOutput => (
					<TabsTrigger value={playerOutput.id}>
						<div className={cn('flex', 'justify-center', 'items-center')}>
							<img
								src={`/civ${hashToIcon(playerOutput.civilizationName)}.PNG`}
								className={cn('w-[40px]', 'mr-2', 'aspect-square')}
								alt={`Icon ${hashToIcon(playerOutput.civilizationName)}`}
							/>
							<span>{playerOutput.civilizationName}</span>
						</div>
					</TabsTrigger>
				))}
			</TabsList>
			{turnOutput.outputs.map(playerOutput => (
				<TabsContent
					key={playerOutput.id}
					title={playerOutput.civilizationName}
					value={playerOutput.id}
				>
					<PlayerSummary playerOutput={playerOutput} />
				</TabsContent>
			))}
		</Tabs>
	)
}
export const PlotSummary = () => {
	const { game } = useGame()
	const round = game.rounds.at(-1)
	if (!round) {
		return null
	}
	return <RoundSummary turnOutput={round} />
}
