import { procedure, router } from '@/core/trpc'

const appRouter = router({
	health: procedure.query(async () => ({ ok: true })),
})

export default appRouter
export type AppRouter = typeof appRouter
