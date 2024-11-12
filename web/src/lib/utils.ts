import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function thanosBeforeAction({
	thanosContainerRef,
	action,
}: {
	thanosContainerRef: React.MutableRefObject<HTMLDivElement | null>
	action: () => void
}) {
	const container = thanosContainerRef.current
	if (container) {
		container.style.filter = 'url(#dissolve-filter)'
		const displacementMap = document.querySelector(
			'#dissolve-filter feDisplacementMap',
		)

		if (displacementMap) {
			container.style.transition = 'opacity 1s ease-out, transform 1s ease-out'
			container.style.opacity = '0'
			container.style.transform = 'scale(1.1)'

			let scale = 0
			const interval = setInterval(() => {
				scale += 100
				displacementMap.setAttribute('scale', `${scale}`)
				if (scale >= 2000) {
					clearInterval(interval)
				}
			}, 16)
			setTimeout(() => {
				action()
			}, 1000)
		}
	}
}
