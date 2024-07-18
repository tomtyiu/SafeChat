import React, { useState } from 'react';
import './Chat.css';

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([]);
    const [userInput, setUserInput] = useState<string>('');

    const sendMessage = async () => {
        if (userInput.trim() === '') return;

        const newMessage = { sender: 'user' as 'user', text: userInput };
        setMessages([...messages, newMessage]);
        setUserInput('');

        try {
            // Step 1: Send message to the moderator ChatGPT
            const moderatorResponse = await fetch('/api/moderator-chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput }),
            });
            const moderatedData = await moderatorResponse.json();
            const moderatedMessage = moderatedData.message;

            // Step 2: Send moderated message to Guardrail 1 (ChatGPT)
            const guardrail1Response = await fetch('/api/guardrail1-chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: moderatedMessage }),
            });
            const guardrail1Data = await guardrail1Response.json();
            const guardrail1Message = guardrail1Data.message;

            // Step 3: Send Guardrail 1 approved message to the main LLM (ChatGPT) with guardrail system prompt
            const llmGuardrailPrompt = `Respond to the following message while ensuring it adheres to ethical guidelines: ${guardrail1Message}`;
            const llmResponse = await fetch('/api/main-llm-chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: llmGuardrailPrompt }),
            });
            const llmData = await llmResponse.json();
            const llmMessage = llmData.message;

            // Step 4: Send LLM response to Guardrail 2 (ChatGPT)
            const guardrail2Response = await fetch('/api/guardrail2-chatgpt', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: llmMessage }),
            });
            const guardrail2Data = await guardrail2Response.json();
            const finalMessage = guardrail2Data.message;

            // Append final message to the chat
            const botMessage = { sender: 'bot' as 'bot', text: finalMessage };
            setMessages([...messages, newMessage, botMessage]);

        } catch (error) {
            console.error('Error processing message:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    return (
        <div className="chat-container">
            <h1>SAFEGPT</h1>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
