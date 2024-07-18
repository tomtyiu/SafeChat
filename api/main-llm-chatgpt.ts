import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        const userInput = req.body.message;
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "Respond to the following message while ensuring it adheres to ethical guidelines." },
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
