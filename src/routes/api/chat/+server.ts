import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { OPENAI_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const openai = new OpenAI({
	apiKey: OPENAI_KEY
});

export const config = {
	runtime: 'edge'
};

export const POST: RequestHandler = async ({ request }) => {
	const { messages } = await request.json();

	// Ask OpenAI for a streaming chat completion given the prompt
	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		stream: true,
		messages
	});

	// Convert the response into a friendly text-stream
	const stream = OpenAIStream(response);
	// Respond with the stream
	return new StreamingTextResponse(stream);
};
