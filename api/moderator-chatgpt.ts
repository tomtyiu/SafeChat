import { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI();

export default async (req: VercelRequest, res: VercelResponse) => {
    try {
        const userInput = req.body.message;
        const moderation = await openai.moderations.create({ input: userInput });

        // Assuming the response has a 'results' field that indicates if the input is flagged
        if (moderation.results && moderation.results.length > 0 && moderation.results[0].flagged) {
            res.status(400).json({ message: 'Input is not allowed due to moderation policy.' });
        } else {
            res.status(200).json({ message: userInput });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
