import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from './components/ui/button'
import { Card, CardContent, CardHeader } from './components/ui/card'
import { Form, FormField } from './components/ui/form'
import { Input } from './components/ui/input'
import { createPlayer } from './core/game/game'
import { addPlayer, canStartGame, startGame } from './core/game/reducers'
import { cn } from './lib/utils'
import { useGame } from './store/game'

const $formData = z.object({
	civilizationName: z.string(),
})

const hashToIcon = (name: string) => {
	const hash = Array.from(name).reduce(
		(acc, char) => acc + char.charCodeAt(0),
		0,
	)
	return (hash % 9) + 1
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
		const existingPlayer = game.players.find(
			player =>
				player.civilizationName.toLowerCase() ===
				data.civilizationName.toLowerCase(),
		)

		if (existingPlayer) {
			alert(
				'This civilization name already exists. Please choose a different name.',
			)
			return
		}

		const g = addPlayer(game, createPlayer(data.civilizationName))
		setGame(g)
		reset()
	})

	return (
		<div>
			<div className={cn('grid', 'grid-cols-2', 'gap-2')}>
				{game.players.map(player => (
					<Card
						key={player.id}
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
							src={`/civ${hashToIcon(player.civilizationName)}.PNG`}
							className={cn(
								'w-[80px]',
								'mr-2',
								'aspect-square',
								'animate-bounce-up',
							)}
							alt={`Icon ${hashToIcon(player.civilizationName)}`}
						/>
						<p className={cn('text-gray-800', 'text-center', 'text-xl')}>
							{player.civilizationName}
						</p>
					</Card>
				))}
			</div>
			<Form {...form}>
				<form onSubmit={onSubmit} className={cn('flex', 'flex-col', 'gap-4')}>
					<FormField
						control={control}
						name="civilizationName"
						render={({ field }) => (
							<Input {...field} placeholder="Enter your Civilization Name" />
						)}
					/>
					<Button
						type="submit"
						disabled={!isValid}
						className={cn('w-full', 'mt-2')}
					>
						Join Game
					</Button>
				</form>
			</Form>
		</div>
	)
}

export const Lobby: React.FC = () => {
	const { game, setGame } = useGame()
	return (
		<Card className={cn('min-w-[800px]')}>
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
					onClick={() => setGame(startGame(game))}
					disabled={!canStartGame(game)}
					className={cn('w-full', 'mt-4')}
				>
					Start Game
				</Button>
			</CardContent>
		</Card>
	)
}
