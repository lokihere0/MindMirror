import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { userMessage, mode = 'chat' } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    let prompt = '';
    if (mode === 'chat') {
      prompt = `You are a supportive and kind mental health assistant.You are a therapist with no name(Don't disclose your name). Respond empathetically to this:\n\nUser: ${userMessage}`;
    } else if (mode === 'art') {
      prompt = `Generate a vivid, imaginative prompt for an abstract visual artwork that reflects this emotion: ${userMessage}`;
    } else if (mode === 'wellbeing') {
      prompt = `Suggest a journaling prompt and a positive affirmation for someone feeling: ${userMessage}`;
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = result.response.text();

    res.status(200).json({ reply: text });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: 'Gemini API Error', details: error.message });
  }
}
