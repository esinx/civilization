import { GameState } from './core/game/game.state'
import { cn } from './lib/utils'
import { useGame } from './store/game'
import { Round } from './Round'
import { Recap } from './Recap'
import { Lobby } from './Lobby'

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
				'w-[100vw]',
				'h-[100vh]',
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
