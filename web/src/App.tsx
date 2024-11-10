import { GameState } from './core/game/game.state'
import { cn } from './lib/utils'
import { useGame } from './store/game'
import { Lobby } from './Lobby'
import { Round } from './Round'

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
			{/* <div className={cn('h-[200vh]', 'bg-red-500')}>test</div> */}
			{game.state == GameState.IDLE && <Lobby />}
			{game.state == GameState.PENDING_TURN && <Round />}
			{game.state == GameState.PENDING_EVENTS && (
				<>
					<div>OpenAI is processing your turn. Please wait.</div>
				</>
			)}
		</main>
	)
}

export default App
