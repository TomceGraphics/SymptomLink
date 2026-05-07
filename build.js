const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'script.js');

if (!fs.existsSync(filePath)) {
    console.error('❌ script.js not found at', filePath);
    process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
    '[[TURSO_DATABASE_URL]]': process.env.TURSO_DATABASE_URL || '',
    '[[TURSO_AUTH_TOKEN]]': process.env.TURSO_AUTH_TOKEN || '',
    '[[GEMINI_API_KEY]]': process.env.GEMINI_API_KEY || '',
};

console.log('🔄 Injecting environment variables...');

let replacedCount = 0;
for (const [placeholder, value] of Object.entries(replacements)) {
    if (content.includes(placeholder)) {
        // Use a regex with global flag to replace all occurrences
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, value);
        console.log(`✅ Injected: ${placeholder}`);
        replacedCount++;
    } else {
        console.warn(`⚠️ Placeholder not found: ${placeholder}`);
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log(`✨ Successfully updated script.js (${replacedCount} placeholders replaced).`);
