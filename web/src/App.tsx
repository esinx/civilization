import { GameState } from './core/game/game.state'
import { cn } from './lib/utils'
import { useGame } from './store/game'
import { Round } from './Round'
import { Recap } from './Recap'
import { Lobby } from './Lobby'
import LoadingScreen from './components/LoadingScreen'

const ThanosFilter: React.FC = () => {
	return (
		<>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				style={{
					display: 'none',
				}}
			>
				<defs>
					<filter
						id="dissolve-filter"
						x="-200%"
						y="-200%"
						width="500%"
						height="500%"
						color-interpolation-filters="sRGB"
						overflow="visible"
					>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.004"
							numOctaves="1"
							result="bigNoise"
						/>
						<feComponentTransfer in="bigNoise" result="bigNoiseAdjusted">
							<feFuncR type="linear" slope="3" intercept="-1" />
							<feFuncG type="linear" slope="3" intercept="-1" />
						</feComponentTransfer>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="1"
							numOctaves="1"
							result="fineNoise"
						/>
						<feMerge result="mergedNoise">
							<feMergeNode in="bigNoiseAdjusted" />
							<feMergeNode in="fineNoise" />
						</feMerge>
						<feDisplacementMap
							in="SourceGraphic"
							in2="mergedNoise"
							scale="0"
							xChannelSelector="R"
							yChannelSelector="G"
						/>
					</filter>
				</defs>
			</svg>
		</>
	)
}

const App: React.FC = () => {
	const { game } = useGame()
	return (
		<main
			className={cn(
				'w-screen',
				'h-screen',
				'flex',
				'justify-center',
				'items-center',
			)}
		>
			<ThanosFilter />
			{game.state == GameState.IDLE && <Lobby />}
			{game.state == GameState.COMPLETE && <Recap />}
			{(game.state == GameState.PENDING_TURN ||
				game.state == GameState.PENDING_EVENTS) && (
				<>
					{game.state == GameState.PENDING_EVENTS && <LoadingScreen />}
					<Round />
				</>
			)}
		</main>
	)
}

export default App
