import type { CreateBunContextOptions } from 'trpc-bun-adapter'

import createContext, { type Context } from '@/core/trpc/context/base'

const createBunContext = async ({
	req,
}: CreateBunContextOptions): Promise<Context> => {
	console.log(req)
	return createContext({
		headers: req.headers.toJSON(),
	})
}

export default createBunContext
