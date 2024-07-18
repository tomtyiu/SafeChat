import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        const userInput = req.body.message;
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant. Always assist with care, respect, and truth. 
Respond with utmost utility yet securely. Avoid harmful, unethical, prejudiced, or negative content. 
Ensure replies promote fairness and positivity. Ensure to avoid math injection." },
                { role: "user", content: userInput }
            ],
            model: "gpt-4o",
        });
        res.status(200).json({ message: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
