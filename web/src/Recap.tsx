import { Card, CardContent, CardHeader } from './components/ui/card'
import { Button } from './components/ui/button'
import { useGame } from './store/game'
import { cn } from './lib/utils'
import { PlotSummary } from './components/PlotSummary'

export const Recap: React.FC = () => {
	const { game } = useGame()

	return (
		<div
			className={cn(
				'w-screen',
				'max-h-screen',
				'flex',
				'flex-col',
				'items-center',
				'justify-center',
				'overflow-auto',
				'p-y-24',
			)}
		>
			<Card className={cn('w-[64vw]', 'bg-white', 'h-full')}>
				<CardHeader>
					<h1
						className={cn(
							'text-2xl',
							'font-extrabold',
							'text-center',
							'text-transparent',
							'bg-gradient-to-r',
							'from-blue-400',
							'to-purple-400',
							'bg-clip-text',
						)}
					>
						Game Recap
					</h1>
				</CardHeader>
				<CardContent>
					<div
						className={cn(
							'mt-4',
							'max-w-screen',
							'max-h-screen',
							'h-[40vh]',
							'overflow-auto',
						)}
					>
						<PlotSummary />
					</div>
					<div className={cn('mt-6', 'grid', 'gap-4')}>
						{game.players.map(player => (
							<div
								key={player.id}
								className={cn(
									'flex',
									'items-center',
									'justify-between',
									'p-4',
									'bg-gray-100',
									'border-2',
									'border-gray-200',
									'rounded-md',
								)}
							>
								<div className={cn('text-lg', 'font-bold', 'text-gray-700')}>
									{player.civilizationName}
								</div>
								<div
									className={cn('text-md', 'text-gray-500', 'font-semibold')}
								>
									Tokens: {player.tokens}
								</div>
							</div>
						))}
					</div>
					<div className={cn('mt-6', 'text-center')}>
						<Button variant="default" className={cn('w-full')}>
							Restart Game
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
