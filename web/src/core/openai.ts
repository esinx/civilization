import OpenAI from 'openai'

export const openAI = {
	client: new OpenAI({
		apiKey: import.meta.env.VITE_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true,
	}),
}
