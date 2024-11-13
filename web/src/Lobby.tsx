import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader } from './components/ui/card'
import { Form, FormField } from './components/ui/form'
import { Input } from './components/ui/input'
import { createPlayer } from './core/game/game'
import { addPlayer, canStartGame, startGame } from './core/game/reducers'
import { cn, thanosBeforeAction } from './lib/utils'
import { useGame } from './store/game'
import { Player } from './core/game/game.state'
import { hashToIcon } from './util'

import React, { useRef } from 'react'
import { Dice3Icon } from 'lucide-react'

const generateRandomName = () => {
	const names = [
		'Atlantis',
		'Eldoria',
		'Avalon',
		'Nirvana',
		'Zion',
		'Utopia',
		'Arcadia',
		'Eden',
		'Xanadu',
	]
	return names[Math.floor(Math.random() * names.length)]
}

const $formData = z.object({
	civilizationName: z.string(),
})

const PlayerRow: React.FC<{ player: Player }> = props => {
	return (
		<Card
			key={props.player.id}
			className={cn(
				'flex',
				'justify-start',
				'items-center',
				'mb-2',
				'bg-gray-100',
				'font-bold',
				'shadow-none',
				'p-4',
			)}
		>
			<img
				src={`/civ${hashToIcon(props.player.civilizationName)}.PNG`}
				className={cn('w-[80px]', 'mr-2', 'aspect-square', 'animate-bounce-up')}
				alt={`Icon ${hashToIcon(props.player.civilizationName)}`}
			/>
			<p className={cn('text-gray-800', 'text-center', 'text-xl')}>
				{props.player.civilizationName}
			</p>
		</Card>
	)
}

const AddUserForm: React.FC = () => {
	const { game, setGame } = useGame()

	const form = useForm<z.infer<typeof $formData>>({
		defaultValues: {
			civilizationName: '',
		},
	})
	const {
		handleSubmit,
		control,
		reset,
		formState: { isValid },
	} = form

	const onSubmit = handleSubmit(data => {
		const civilizationName = data.civilizationName.trim()
		const existingPlayer = game.players.find(
			player => player.civilizationName.toLowerCase() === civilizationName,
		)

		if (existingPlayer) {
			alert(
				'This civilization name already exists. Please choose a different name.',
			)
			return
		}
		if (civilizationName.length == 0) {
			return
		}

		const g = addPlayer(game, createPlayer(civilizationName))
		setGame(g)
		reset()
	})

	return (
		<div>
			<div
				className={cn(
					'grid',
					'grid-cols-2',
					'gap-2',
					'overflow-auto',
					'max-h-[200px]',
				)}
			>
				{game.players.map(player => (
					<PlayerRow player={player} />
				))}
			</div>
			<Form {...form}>
				<form onSubmit={onSubmit} className={cn('flex', 'flex-col', 'gap-4')}>
					<FormField
						control={control}
						name="civilizationName"
						render={({ field }) => (
							<>
								<div className={cn('flex', 'flex-col', 'gap-2', 'mt-2')}>
									<div className={cn('flex', 'gap-2', 'mt-2')}>
										<Input
											{...field}
											placeholder="Enter your Civilization Name"
										/>
										<Button
											size="icon"
											onClick={() => {
												let randomName: string | undefined = undefined
												const existingNames = new Set(
													game.players.map(player =>
														player.civilizationName.toLowerCase(),
													),
												)
												do {
													randomName = generateRandomName()
												} while (existingNames.has(randomName.toLowerCase()))
												field.onChange(randomName)
												onSubmit()
											}}
										>
											<Dice3Icon />
										</Button>
									</div>
									<Button
										type="submit"
										disabled={!isValid}
										className={cn('w-full')}
									>
										Join Game
									</Button>
								</div>
							</>
						)}
					/>
				</form>
			</Form>
		</div>
	)
}

export const Lobby: React.FC = () => {
	const { game, setGame } = useGame()
	const containerRef = useRef<HTMLDivElement | null>(null)

	const handleStartGame = () => {
		thanosBeforeAction({
			thanosContainerRef: containerRef,
			action: () => {
				setGame(startGame(game))
			},
		})
	}

	return (
		<Card ref={containerRef} className={cn('min-w-[60vw]')}>
			<CardHeader className={cn('flex', 'items-center', 'relative')}>
				<img
					src="/logo.png"
					className={cn(
						'absolute',
						'w-[200px]',
						'aspect-square',
						'translate-y-[-100px]',
					)}
				/>
				<div className={cn('h-[100px]')} />
				<h1
					className={cn(
						'text-3xl',
						'font-extrabold',
						'text-transparent',
						'bg-gradient-to-r',
						'from-pink-400',
						'to-orange-300',
						'bg-clip-text',
					)}
				>
					CODE OF EMPIRE
				</h1>
				<div>an over-engineered game built just for EAS2030</div>
			</CardHeader>
			<CardContent>
				<AddUserForm />
				<Button
					onClick={handleStartGame}
					disabled={!canStartGame(game)}
					className={cn('w-full', 'mt-4')}
				>
					Start Game
				</Button>
			</CardContent>
		</Card>
	)
}
