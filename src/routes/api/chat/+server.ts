import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText, tool } from 'ai';

import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import { z } from 'zod';

const openai = createOpenAI({
	apiKey: env.OPENAI_KEY ?? ''
});

export const POST = (async ({ request }) => {
	const { messages } = await request.json();

	const result = await streamText({
		model: openai('gpt-4-turbo-preview'),
		tools: {
			weather: tool({
				description: 'Get the weather in a location',
				parameters: z.object({
					location: z.string().describe('The location to get the weather for')
				}),
				execute: async ({ location }) => ({
					location,
					temperature: 72 + Math.floor(Math.random() * 21) - 10
				})
			})
		},
		messages
	});

	return new StreamingTextResponse(result.toAIStream());
}) satisfies RequestHandler;
