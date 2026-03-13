import * as ai from '../services/ai.service.js';

export const getResult = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: "Prompt is required" });
        }

        const result = await ai.generateResult(prompt);
        
        // Safety check: ensure we can parse the AI's response
        try {
            const parsedResult = JSON.parse(result);
            res.status(200).json(parsedResult); 
        } catch (parseError) {
            console.error("Failed to parse AI response:", result);
            res.status(500).json({ 
                message: "AI returned an invalid format", 
                rawResponse: result 
            });
        }

    } catch (error) {
        console.error("Controller Error:", error.message);
        res.status(500).send({ message: error.message });
    }
}