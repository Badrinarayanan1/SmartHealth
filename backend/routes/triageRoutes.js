const express = require('express');
const router = express.Router();
// Use dynamic import for node-fetch or require if using v2. 
// Assuming standard node environment, let's stick to fetch if available (Node 18+) or axios/node-fetch.
// Since we installed node-fetch in previous step, we'll use it.
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const HF_API_URL = "https://api-inference.huggingface.co/models/valhalla/distilbart-mnli-12-1";
// NOTE: Ideally, the key should be in .env. We will use a placeholder or public if available, 
// but inference API usually requires a token. I'll add a check.
const HF_API_KEY = process.env.HF_API_KEY;

router.post('/', async (req, res) => {
    try {
        const { symptoms } = req.body;
        if (!symptoms) return res.status(400).json({ error: "Symptoms required" });

        const candidate_labels = ["Cardiology", "Orthopedics", "General Medicine", "Neurology", "Pediatrics"];

        const response = await fetch(HF_API_URL, {
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({
                inputs: symptoms,
                parameters: { candidate_labels }
            }),
        });

        const result = await response.json();

        if (result.error) {
            console.error("HF API Error:", result.error);
            // Fallback to basic keyword matching if API fails/rate limits
            return res.json({
                department: fallbackTriage(symptoms),
                confidence: 0.5,
                source: "fallback"
            });
        }

        // HF Zero-shot returns { sequence, labels: [], scores: [] }
        const bestLabel = result.labels ? result.labels[0] : "General Medicine";
        const confidence = result.scores ? result.scores[0] : 0;

        res.json({ department: bestLabel, confidence, source: "ai" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Triage failed" });
    }
});

function fallbackTriage(text) {
    const t = text.toLowerCase();
    if (t.includes('heart') || t.includes('chest')) return 'Cardiology';
    if (t.includes('bone') || t.includes('joint')) return 'Orthopedics';
    if (t.includes('head') || t.includes('dizzy')) return 'Neurology';
    return 'General Medicine';
}

module.exports = router;
