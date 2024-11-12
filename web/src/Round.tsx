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
import { Input } from './components/ui/input'
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
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from './components/ui/alert-dialog'

const $formData = z.object({
	allocation: $allocation,
	command: z.string().max(30).min(1),
})

const ALLOCATABLE_LIST = [
	Allocatable.SRD,
	Allocatable.MD,
	Allocatable.EWT,
	Allocatable.IPW,
	Allocatable.ESR,
	Allocatable.HPS,
	Allocatable.TD,
	Allocatable.ACNI,
]
const allPrompts = [
	'Wage a global war',
	'Find extraterrestrial life',
	'Subsidize technological advancement on chip design',
	'Educate masses on importance of engineering ethics',
]

/**
 *  {
	SRD = 'Science Research and Development',
	MD = 'Military and Defense',
	EWT = 'Education and Workforce Training',
	IPW = 'Infrastructure and Public Works',
	ESR = 'Environmental Sustainability and Resources',
	HPS = 'Healthcare and Public Safety',
	TD = 'Trade and Diplomacy',
	ACNI = 'Arts, Culture, and National Identity',
 * 
 */

const toDisplayAllocatable = (allocatable: Allocatable) =>
	({
		[Allocatable.SRD]: '🧪 Science R & D',
		[Allocatable.MD]: '🪖 Military & Defense',
		[Allocatable.EWT]: '🎓 Education & Workforce Training',
		[Allocatable.IPW]: '🏢 Infrastructure & Public Works',
		[Allocatable.ESR]: '🌳 Environmental Sustainability',
		[Allocatable.HPS]: '🏥 Healthcare & Public Safety',
		[Allocatable.TD]: '🤝 Trade & Diplomacy',
		[Allocatable.ACNI]: '🎨 Arts & Culture',
	}[allocatable])

const UpdateRoundForm: React.FC<{
	player: Player
	value?: PlayerInput
	onSubmit?: (data: PlayerInput) => void
}> = props => {
	const { player } = props
	const form = useForm<z.infer<typeof $formData>>({
		defaultValues: props.value ?? {
			allocation: Object.fromEntries(
				ALLOCATABLE_LIST.map(allocatable => [
					allocatable,
					Math.floor((player?.tokens ?? 0) / ALLOCATABLE_LIST.length),
				]),
			) as Allocation,
			command: '',
		},
		mode: 'onChange',
	})
	const {
		handleSubmit,
		control,
		formState: { isValid },
		watch,
	} = form

	const formAllocation = watch('allocation')
	const commandValue = watch('command') || ''
	const allocRemaining =
		player.tokens -
		Object.values(formAllocation).reduce((acc, val) => acc + val, 0)

	const charsRemaining = 50 - commandValue.length

	const onSubmit = handleSubmit(data =>
		props.onSubmit?.({
			player,
			...data,
		}),
	)

	return (
		<Card>
			<CardHeader>
				<h1 className={cn('text-xl', 'font-bold')}>
					{player.civilizationName}
				</h1>
				<p>Tokens Remaining {allocRemaining}</p>
				<hr className={cn('border-t-2', 'border-gray-200', 'my-2')} />
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={onSubmit}>
						{ALLOCATABLE_LIST.map(allocatable => (
							<FormField
								control={control}
								name={`allocation.${allocatable}`}
								render={({ field }) => (
									<div
										className={cn('flex', 'justify-between', 'gap-4', 'mb-4')}
									>
										<label htmlFor={allocatable} className={cn('text-lg')}>
											{toDisplayAllocatable(allocatable)}
										</label>
										<div className={cn('flex', 'items-center', 'gap-4')}>
											<Button
												disabled={field.value === 0}
												variant="outline"
												onClick={() => field.onChange(field.value - 1)}
												className={cn('w-8', 'h-8')}
											>
												-
											</Button>
											<div
												className={cn(
													'text-lg',
													'font-bold',
													'w-12',
													'text-center',
													'tabular-nums',
												)}
											>
												{field.value}
											</div>
											<Button
												disabled={allocRemaining === 0}
												variant="outline"
												onClick={() => field.onChange(field.value + 1)}
												className={cn('w-8', 'h-8')}
											>
												+
											</Button>
										</div>
									</div>
								)}
							/>
						))}
						<FormField
							control={control}
							name="command"
							render={({ field }) => {
								const [suggestions, setSuggestions] = useState<string[]>([])
								const [showCreateOption, setShowCreateOption] = useState(false)

								const handleInputChange = e => {
									const inputValue = e.target.value
									field.onChange(inputValue)

									const matchingPrompts = allPrompts.filter(prompt =>
										prompt.toLowerCase().includes(inputValue.toLowerCase()),
									)
									setSuggestions(matchingPrompts)

									setShowCreateOption(!matchingPrompts.includes(inputValue))
								}

								const handleSuggestionClick = suggestion => {
									field.onChange(suggestion)
									setSuggestions([])
									setShowCreateOption(false)
								}

								const handleCreateNew = () => {
									field.onChange(field.value)
									setSuggestions([])
									setShowCreateOption(false)
								}

								return (
									<FormItem>
										<FormLabel>Agenda</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Enter your decade agenda"
												maxLength={50}
												className={cn('w-full')}
												onChange={handleInputChange}
											/>
										</FormControl>
										{suggestions.length > 0 && (
											<ul className="bg-white border rounded shadow-lg max-h-40 overflow-auto">
												{suggestions.map((suggestion, index) => (
													<li
														key={index}
														onClick={() => handleSuggestionClick(suggestion)}
														className="cursor-pointer p-2 hover:bg-gray-200"
													>
														{suggestion}
													</li>
												))}
											</ul>
										)}
										{showCreateOption && (
											<div
												onClick={handleCreateNew}
												className="cursor-pointer text-blue-600 mt-2"
											>
												Create new: <strong>{field.value}</strong>
											</div>
										)}
										<p className="text-sm text-gray-500">
											{charsRemaining} characters remaining
										</p>
										<FormMessage />
									</FormItem>
								)
							}}
						/>
						<Button
							type="submit"
							disabled={!isValid || allocRemaining !== 0}
							className={cn('w-full', 'mt-4')}
							variant="secondary"
						>
							Allocate
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

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
			<div className={cn('w-[100vw]', 'h-[100vh]', 'flex')}>
				<div
					className={cn(
						'w-[480px]',
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

					<div className={cn('my-4', 'h-full')}>
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
