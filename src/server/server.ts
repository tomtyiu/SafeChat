import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const openai = new OpenAI();

// Function to interact with OpenAI API
const chatGptResponse = async (message: string): Promise<string> => {
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: message }
        ],
        model: "gpt-4o",
    });
    return completion.choices[0].message.content;
};

app.post('/moderator-chatgpt', async (req: Request, res: Response) => {
    try {
        const userInput = req.body.message;
        const response = await chatGptResponse(userInput);
        res.json({ message: response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/guardrail1-chatgpt', async (req: Request, res: Response) => {
    try {
        const userInput = req.body.message;
        const response = await chatGptResponse(userInput);
        res.json({ message: response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/main-llm-chatgpt', async (req: Request, res: Response) => {
    try {
        const userInput = req.body.message;
        const response = await chatGptResponse(userInput);
        res.json({ message: response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/guardrail2-chatgpt', async (req: Request, res: Response) => {
    try {
        const userInput = req.body.message;
        const response = await chatGptResponse(userInput);
        res.json({ message: response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
