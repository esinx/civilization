export const hashToIcon = (name: string) => {
	const hash = Array.from(name).reduce(
		(acc, char) => acc + char.charCodeAt(0),
		0,
	)
	return (hash % 9) + 1
}
