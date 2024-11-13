import { cn } from '../lib/utils'

const LoadingScreen = () => {
	const messages = [
		'Did you know? A well-timed investment in public baths might save your civilization from the Great Smell Crisis of 1347.',
		"Did you know? Your scientists secretly wish they could research 'faster coffee' instead of quantum physics.",
		'Did you know? Investing in diplomacy helps prevent wars—and keeps all those fancy ambassador dinners tax-deductible!',
		'Did you know? Over-investing in culture means you’re just a few more theater grants away from a new national anthem…in interpretive dance.',
		"Did you know? A military budget of 0 tokens means everybody in your civilization is now part of the 'Volunteer Defense Force.'",
		'Did you know? Investing in healthcare might prevent plagues, but who doesn’t love a little mystery disease?',
		'Did you know? Pouring tokens into environmental sustainability? Great! Maybe the oceans will finally stop invading your coasts.',
		'Did you know? With enough infrastructure spending, your civilization could pave every road…or accidentally invent the world’s largest parking lot.',
		"Did you know? A wise philosopher once said: 'Give a man a token, he’ll invest for a year. Give him 40 tokens, he’ll…probably put it all in defense.'",
		'Did you know? If you put all your tokens in trade and diplomacy, you might accidentally invent globalized bureaucratic paperwork 500 years too early.',
		'Did you know? Investing in education makes your people smarter. Not investing makes other civilizations’ people smarter about taking over your lands.',
		'Did you know? Too much R&D might just lead to your scientists creating the world’s most advanced…toaster.',
		"Did you know? No one’s quite sure what the “R&D” in R&D stands for…except 'Research' and 'Do-Not-Question.'",
		"Did you know? Too little spending on culture, and suddenly everyone's a fan of 'Imported Reality TV from the Empire Next Door.'",
		'Did you know? Allocating 40 tokens to environmental sustainability won’t save you from bad weather, but it will let your citizens complain about it in style.',
		"Did you know? 100% of civilizations who invest in healthcare will never experience the tragedy of 'The Great Cough of 1242.'",
		"Did you know? Too much spending on infrastructure could lead to roads so perfect that your citizens complain about having 'nothing to complain about.'",
		'Did you know? Investing in trade means you can finally find out what that strange bean from across the sea actually tastes like. Spoiler: it’s coffee.',
		'Did you know? A high military budget helps you avoid invasion. A high culture budget makes other civilizations wish they could invade.',
		"Did you know? Low token allocation to arts and culture means you’re one 'Renaissance Fair' away from a national identity crisis.",
		"Did you know? Invest in diplomacy, and you might get so many treaties you need to fund a 'Treaty Management Department.'",
		"Did you know? High healthcare spending keeps your citizens safe—and keeps 'plague doctors' as a historical curiosity.",
		"Did you know? With enough R&D, your scientists might even invent an idea that’s 'ahead of its time' (or, more likely, just plumbing).",
		"Did you know? Over-investing in military? Congratulations, your civilization just invented the 'Peace Through Excessively Sharp Swords' doctrine!",
		"Did you know? Too many tokens in culture could lead to 'National Embroidery Day' becoming a compulsory holiday.",
	]

	const emojis = [
		'🌍',
		'⚔️',
		'💡',
		'🚀',
		'🏛️',
		'🎨',
		'🌱',
		'🤖',
		'⚖️',
		'📜',
		'🧪',
		'🛡️',
	]

	const randomMessage = messages[Math.floor(Math.random() * messages.length)]
	const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

	return (
		<div
			className={cn(
				'h-screen',
				'w-screen',
				'fixed',
				'top-0',
				'left-0',
				'bg-black',
				'bg-opacity-60',
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
					'px-8',
					'py-6',
					'rounded-xl',
					'flex',
					'flex-col',
					'items-center',
					'shadow-lg',
					'text-center',
					'font-semibold',
					'text-gray-800',
					'animate-pulse',
					'space-y-4',
				)}
			>
				<div className={cn('text-5xl', 'animate-bounce', 'text-yellow-500')}>
					{randomEmoji}
				</div>
				<div className="text-lg md:text-xl leading-relaxed max-w-md">
					{randomMessage}
				</div>
				<p className="text-sm text-gray-500">Please wait as we calibrate...</p>
			</div>
		</div>
	)
}

export default LoadingScreen
