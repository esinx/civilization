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
	PlayerInput,
} from './core/game/game.state'
import { executeTurn } from './core/game/reducers'
import { cn } from './lib/utils'
import { useGame } from './store/game'

const $formData = z.object({
	allocation: $allocation,
	command: z.string().max(30),
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
		[Allocatable.SRD]: '🧪 Science R&D',
		[Allocatable.MD]: '🪖 Military & Defense',
		[Allocatable.EWT]: '🎓 Education & Workforce Training',
		[Allocatable.IPW]: '🏢 Infrastructure & Public Works',
		[Allocatable.ESR]: '🌳 Environmental Sustainability',
		[Allocatable.HPS]: '🏥 Healthcare & Public Safety',
		[Allocatable.TD]: '🤝 Trade & Diplomacy',
		[Allocatable.ACNI]: '🎨 Arts & Culture',
	}[allocatable])

const UpdateRoundForm: React.FC<{
	playerId: string
	onSubmit?: (data: PlayerInput) => void
}> = props => {
	const { game } = useGame()
	const player = game.players.find(player => player.id === props.playerId)

	const form = useForm<z.infer<typeof $formData>>({
		defaultValues: {
			allocation: Object.fromEntries(
				ALLOCATABLE_LIST.map(allocatable => [allocatable, 0]),
			) as Allocation,
			command: '',
		},
	})

	if (!player) {
		return null
	}

	const {
		handleSubmit,
		control,
		formState: { isValid },
		watch,
	} = form

	const formAllocation = watch('allocation')
	const remaining =
		player.tokens -
		Object.values(formAllocation).reduce((acc, val) => acc + val, 0)

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
				<p>Tokens Remaining {remaining}</p>
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
												disabled={
													field.value === player.tokens || remaining === 0
												}
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
							render={({ field }) => (
								<FormItem>
									<FormLabel>Command</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="Enter your command"
											className={cn('w-full')}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={!isValid || remaining !== 0}
							className={cn('w-full', 'mt-4')}
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
	const [playerInputs, setPlayerInputs] = useState<Record<string, PlayerInput>>(
		{},
	)

	const onUpdateRound = (playerId: string, playerInput: PlayerInput) => {
		setPlayerInputs(prevInputs => ({ ...prevInputs, [playerId]: playerInput }))
	}

	const onSubmit = async () => {
		// TODO: does not handle invalid input
		const flattenedPlayerInputs = Object.values(playerInputs)
		const turnOutput = await executeTurn(game, flattenedPlayerInputs)
		setGame(turnOutput.game)
	}

	return (
		<div>
			<div className={cn('w-[100vw]', 'h-[100vh]', 'p-8')}>
				<h1 className={cn('text-3xl', 'font-bold', 'text-white')}>
					ROUND {game.turn + 1}
				</h1>
				{game.rounds.length > 0 && <PlotSummary />}
				<div
					className={cn(
						'grid',
						'grid-template-columns-[repeat(auto-fill,minmax(300px,1fr))]',
						'gap-4',
						'mt-4',
					)}
				>
					{game.players.map(player => (
						<UpdateRoundForm
							playerId={player.id}
							onSubmit={(data: PlayerInput) => onUpdateRound(player.id, data)}
						/>
					))}
				</div>
			</div>
			<div className={cn('fixed', 'bottom-0', 'left-8', 'right-8', 'z-10')}>
				<Card className={cn('rounded-b-none')}>
					<CardHeader>
						<Button className={cn('w-full')} onClick={onSubmit} size="lg">
							PROCEED
						</Button>
					</CardHeader>
					<CardContent></CardContent>
				</Card>
			</div>
		</div>
	)
}
