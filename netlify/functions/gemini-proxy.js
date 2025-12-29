const https = require('https');

exports.handler = async (event) => {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    if (!GEMINI_API_KEY) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                error: "API Key Missing",
                details: "GEMINI_API_KEY is not set in Netlify Environment Variables."
            }),
        };
    }

    // Handle potential base64 encoding from Netlify
    let requestBody = event.body;
    if (event.isBase64Encoded) {
        requestBody = Buffer.from(event.body, 'base64').toString('utf8');
    }

    return new Promise((resolve) => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

        const req = https.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: { "Content-Type": "application/json" },
                    body: data
                });
            });
        });

        req.on('error', (e) => {
            resolve({
                statusCode: 500,
                body: JSON.stringify({ error: "Proxy Error", details: e.message })
            });
        });

        req.write(requestBody);
        req.end();
    });
};
