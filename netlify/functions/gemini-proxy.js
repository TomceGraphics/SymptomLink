const https = require('https');

exports.handler = async (event) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // 1. Check Method
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method Not Allowed" })
        };
    }

    // 2. Check API Key
    if (!GEMINI_API_KEY) {
        console.error("❌ GEMINI_API_KEY is missing from environment variables.");
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                error: "GEMINI_API_KEY is not configured.",
                details: "Please add GEMINI_API_KEY to your Netlify Site Settings > Environment Variables."
            }),
        };
    }

    // 3. Proxy Request
    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*" // Ensure CORS is handled if needed
                    },
                    body: data
                });
            });
        });

        req.on('error', (e) => {
            console.error("❌ Proxy Request Error:", e);
            resolve({
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Internal Server Error", details: e.message })
            });
        });

        req.write(event.body);
        req.end();
    });
};
