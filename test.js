// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { CohereClient } from 'cohere-ai';

const app = express();
const port = 5000; // Can be changed

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Cohere setup
const cohere = new CohereClient({
    token: "6LPevyqFYtHc3Mue7lhsHsz5FrJnJ6elOCu8Jsj9", // Replace with your actual API key
});

// POST endpoint to receive messages from frontend
app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;

        const response = await cohere.chat({
            model: "command-a-03-2025",
            message: message,
        });

        res.json({ reply: response.text });
    } catch (err) {
        console.error("Cohere API error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Cohere API server running on http://localhost:${port}`);
});
