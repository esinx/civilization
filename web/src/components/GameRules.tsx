const GameRules = () => (
	<div className="bg-white rounded-lg">
		<h1 className="text-2xl font-extrabold text-gray-800 mb-4">
			Code of Empires
		</h1>
		<p className="text-gray-600 mb-4">
			Each round represents 10 years, where your civilization will evolve based
			on strategic investments and external events. Your aim is to balance
			progress across various sectors to maintain stability and prosperity.
		</p>

		<h2 className="text-xl font-bold text-gray-700 mb-2">
			1. Token Allocation
		</h2>
		<ul className="list-disc list-inside mb-4">
			<li>
				Each round, you start with{' '}
				<span className="font-semibold">40 tokens</span>.
			</li>
			<li>
				Allocate tokens across eight investment categories:
				<ol className="list-decimal list-inside ml-4">
					<li>Scientific Research and Development</li>
					<li>Military and Defense</li>
					<li>Education and Workforce Training</li>
					<li>Infrastructure and Public Works</li>
					<li>Environmental Sustainability and Resources</li>
					<li>Healthcare and Public Safety</li>
					<li>Trade and Diplomacy</li>
					<li>Arts, Culture, and National Identity</li>
				</ol>
			</li>
			<li>
				Thoughtful allocation is crucial, as each category impacts others in
				direct or subtle ways.
			</li>
		</ul>

		<h2 className="text-xl font-bold text-gray-700 mb-2">
			2. Purpose Statement
		</h2>
		<p className="text-gray-600 mb-4">
			Each round, provide a{' '}
			<span className="font-semibold">short purpose statement</span> (up to 30
			characters) reflecting your civilization's focus for that decade.
		</p>

		<h2 className="text-xl font-bold text-gray-700 mb-2">
			3. Annual Events and Consequences
		</h2>
		<p className="text-gray-600 mb-4">
			Each round represents a decade, with events that unfold each year based on
			your investments and purpose.
		</p>

		<h2 className="text-xl font-bold text-gray-700 mb-2">
			4. Inter-Civilization Interactions
		</h2>
		<p className="text-gray-600 mb-4">
			Encounter other civilizations, leading to alliances, trade agreements,
			cultural exchanges, or conflicts.
		</p>

		<h2 className="text-xl font-bold text-gray-700 mb-2">
			5. End of Round Summary and Adjustments
		</h2>
		<p className="text-gray-600 mb-4">
			Receive a summary of major events, consequences, and token adjustments for
			the next round.
		</p>

		<h2 className="text-xl font-bold text-gray-700 mb-2">
			6. Victory and Final Tally
		</h2>
		<p className="text-gray-600">
			After 5 rounds (50 years), the game concludes, with the final tally based
			on stability, innovation, and citizen well-being.
		</p>
	</div>
)

export default GameRules
