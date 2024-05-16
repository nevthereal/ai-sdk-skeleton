import { createOpenAI } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText, tool } from 'ai';
import wretch from 'wretch';

import { OPENAI_KEY, WEATHER_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';
import { z } from 'zod';

const openai = createOpenAI({
	apiKey: OPENAI_KEY ?? ''
});

export const POST = (async ({ request }) => {
	const { messages } = await request.json();

	const result = await streamText({
		model: openai('gpt-4-turbo-preview'),
		tools: {
			weather: tool({
				description: 'Get the temperature of a location in Fahrenheit',
				parameters: z.object({
					location: z.string().describe('The location to get the temperature from')
				}),
				execute: async ({ location }) => {
					const locData = await wretch(
						`http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${WEATHER_KEY}`
					)
						.get()
						.json((json) => {
							return { lat: json[0].lat, lon: json[0].lon };
						});

					const temperature = await wretch(
						`https://api.openweathermap.org/data/3.0/onecall?lat=${locData.lat}&lon=${locData.lon}&appid=${WEATHER_KEY}`
					)
						.get()
						.json((json) => {
							return json.current.temp;
						});
					return temperature;
				}
			})
		},
		messages
	});

	return new StreamingTextResponse(result.toAIStream());
}) satisfies RequestHandler;
