import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import React from 'react'
import MultipleSelector, { Option } from './ui/multiple-selector'
import {
	PlayerInput,
	$allocation,
	Allocatable,
	Allocation,
	Player,
} from '../core/game/game.state'
import { cn } from '../lib/utils'

const MAX_INPUT_LENGTH = 50

const AGENDA_DEFAULT_OPTIONS: Option[] = [
	'Strengthen alliances for trade expansion',
	'Innovate clean energy to secure resources',
	'Enhance healthcare resilience and preparedness',
	'Develop skilled workforce for tech innovation',
	'Establish cultural identity through arts',
	'Boost military to deter regional conflicts',
	'Improve infrastructure to spur urban growth',
	'Further space exploration for defense',
].map(label => ({ label, value: label }))

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
		setValue,
		watch,
	} = form

	const formAllocation = watch('allocation')
	const allocRemaining =
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
				<div className={cn('flex', 'justify-between', 'items-center')}>
					<h1 className={cn('text-xl', 'font-bold')}>
						{player.civilizationName}
					</h1>
					<div className={cn('flex', 'justify-between', 'items-center')}>
						<p className={cn('mr-4', 'text-grey-600', 'text-sm')}>
							Tokens Remaining {allocRemaining}
						</p>
						<Button
							size="sm"
							variant="secondary"
							onClick={() => {
								const defaultAllocation = Object.fromEntries(
									ALLOCATABLE_LIST.map(allocatable => [allocatable, 0]),
								) as Allocation
								setValue('allocation', defaultAllocation)
							}}
						>
							Clear
						</Button>
					</div>
				</div>
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
								const handleInputChange = (options: Option[]) => {
									if (options.length >= 0) {
										field.onChange(options[0].value)
									}
								}
								return (
									<FormItem>
										<FormLabel>
											<div className={cn('justify-start', 'flex')}>
												<p>Agenda</p>
												<p className={cn('text-xs', 'text-gray-500', 'mx-1')}>
													(50 characters max)
												</p>
											</div>
										</FormLabel>
										<FormControl>
											<MultipleSelector
												hidePlaceholderWhenSelected
												hideClearAllButton
												className={cn('w-full', 'h-full')}
												maxSelected={1}
												defaultOptions={AGENDA_DEFAULT_OPTIONS}
												placeholder="Enter your decade agenda"
												creatable
												emptyIndicator={
													<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
														no results found.
													</p>
												}
												inputProps={{ maxLength: MAX_INPUT_LENGTH }}
												onChange={handleInputChange}
											/>
										</FormControl>
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

export default UpdateRoundForm
