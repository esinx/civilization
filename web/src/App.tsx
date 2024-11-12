import { GameState } from './core/game/game.state'
import { cn } from './lib/utils'
import { useGame } from './store/game'
import { Lobby } from './Lobby'
import { Round } from './Round'
import { Recap } from './Recap'

const App: React.FC = () => {
	const { game } = useGame()
	return (
		<main
			className={cn(
				'w-[100vw]',
				'h-[100vh]',
				'flex',
				'justify-center',
				'items-center',
			)}
		>
			{game.state == GameState.IDLE && <Lobby />}
			{game.state == GameState.COMPLETE && <Recap />}
			{(game.state == GameState.PENDING_TURN ||
				game.state == GameState.PENDING_EVENTS) && (
				<>
					{game.state == GameState.PENDING_EVENTS && (
						<div
							className={cn(
								'h-[100vh]',
								'w-[100vw]',
								'fixed',
								'top-0',
								'left-0',
								'bg-black',
								'bg-opacity-50',
								'flex',
								'justify-center',
								'items-center',
								'z-50',
								'backdrop-blur-md',
							)}
						>
							<div
								className={cn(
									'bg-white',
									'p-4',
									'rounded-lg',
									'flex',
									'flex-col',
									'items-center',
									'font-bold',
									'animate-pulse',
								)}
							>
								Interesting things are happening...
							</div>
						</div>
					)}
					<Round />
				</>
			)}
		</main>
	)
}

export default App
