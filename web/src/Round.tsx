import { CheckCircle, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PlotSummary } from './components/PlotSummary'
import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader } from './components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './components/ui/form'
import {
	$allocation,
	Allocatable,
	Allocation,
	GameState,
	Player,
	PlayerInput,
} from './core/game/game.state'
import { executeTurn } from './core/game/reducers'
import { cn } from './lib/utils'
import { useGame } from './store/game'
import GameRules from './components/GameRules'
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './components/ui/alert-dialog'

import React from 'react'
import UpdateRoundForm from './components/UpdateRoundForm'

export const Round: React.FC = () => {
	const { game, setGame } = useGame()
	const [displayedPlayerId, setDisplayedPlayerId] = useState<string | null>(
		null,
	)
	const [playerInputs, setPlayerInputs] = useState<Record<string, PlayerInput>>(
		{},
	)

	const onSubmit = async () => {
		const flattenedPlayerInputs = Object.values(playerInputs)
		setGame({
			...game,
			state: GameState.PENDING_EVENTS,
		})
		const turnOutput = await executeTurn(game, flattenedPlayerInputs)
		setGame(turnOutput.game)
		setPlayerInputs({})
		setDisplayedPlayerId(null)
	}

	const displayedPlayer = game.players.find(p => p.id === displayedPlayerId)

	const canStart =
		game.state == GameState.PENDING_TURN &&
		game.players.every(p => playerInputs[p.id])

	return (
		<div>
			<div className={cn('w-screen', 'h-screen', 'flex')}>
				<div
					className={cn(
						'w-[36vw]',
						'bg-white',
						'flex-grow-0',
						'flex-shrink-0',
						'p-4',
						'overflow-y-auto',
					)}
				>
					<div
						className={cn(
							'justify-between',
							'flex',
							'content-center',
							'items-center',
						)}
					>
						<h1
							className={cn(
								'text-2xl',
								'font-extrabold',
								'text-transparent',
								'bg-gradient-to-r',
								'from-pink-400',
								'to-orange-300',
								'bg-clip-text',
							)}
						>
							ROUND {game.turn + 1}
						</h1>
						{game.turn != 0 && (
							<>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="ghost" size="icon">
											<HelpCircle size={24} className="text-gray-500" />
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent
										className={cn(
											'w-[1000px]',
											'max-w-screen',
											'max-h-screen',
											'overflow-auto',
											'm-4',
											'pb-4',
										)}
									>
										<AlertDialogHeader>
											<AlertDialogTitle>Game Rules</AlertDialogTitle>
											<AlertDialogDescription>
												<GameRules />
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Sounds good!</AlertDialogCancel>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</>
						)}
					</div>

					<div className={cn('my-4', 'max-h-screen', 'h-full')}>
						{game.turn == 0 ? <GameRules /> : <PlotSummary />}
					</div>
				</div>
				<div className={cn('flex-1', 'overflow-y-scroll', 'p-8')}>
					<Card>
						<CardContent className={cn('p-4')}>
							<div className={cn('grid', 'gap-2', 'grid-cols-3')}>
								{game.players.map(player => (
									<div
										key={player.id}
										onClick={() => setDisplayedPlayerId(player.id)}
										className={cn(
											'flex',
											'items-center',
											'justify-between',
											'py-2',
											'px-4',
											'bg-gray-100',
											'border-2',
											'border-gray-200',
											displayedPlayerId === player.id && [
												'border-primary',
												'bg-white',
												'shadow-md',
											],
											'rounded-md',
											'cursor-pointer',
										)}
									>
										<div className={cn('flex', 'items-center', 'gap-4')}>
											<div
												className={cn(
													'font-bold',
													'text-primary',
													'tabular-nums',
												)}
											>
												{player.tokens}
											</div>
											<div
												className={cn('text-md', 'text-gray-700', 'font-bold')}
											>
												{player.civilizationName}
											</div>
										</div>
										<div className={cn('flex', 'items-center', 'gap-4')}>
											<div>
												{typeof playerInputs[player.id] === 'undefined' ? (
													<HelpCircle size={24} className="text-gray-500" />
												) : (
													<CheckCircle size={24} className="text-primary" />
												)}
											</div>
										</div>
									</div>
								))}
							</div>
							<div>
								<Button
									onClick={onSubmit}
									disabled={!canStart}
									className={cn(
										'w-full',
										'mt-4',
										canStart && ['animate-pulse'],
									)}
									size="lg"
								>
									Start Round
								</Button>
							</div>
						</CardContent>
					</Card>
					{displayedPlayer && (
						<div className={cn('mt-4')}>
							<UpdateRoundForm
								key={displayedPlayer.id}
								player={displayedPlayer}
								value={playerInputs[displayedPlayer.id]}
								onSubmit={input =>
									setPlayerInputs(prevInputs => ({
										...prevInputs,
										[displayedPlayer.id]: input,
									}))
								}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
