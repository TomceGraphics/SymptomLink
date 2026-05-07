const fs = require('fs');
const path = require('path');

// Local testing: Load .env if it exists
if (fs.existsSync('.env')) {
    const envConfig = fs.readFileSync('.env', 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
    console.log('Loaded local .env file');
}

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

// Files to copy directly to dist
const filesToCopy = ['index.html', '_redirects'];
filesToCopy.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        fs.copyFileSync(path.join(__dirname, file), path.join(distDir, file));
        console.log(`Copied ${file} to dist/`);
    }
});

// Process script.js with environment variables
let scriptContent = fs.readFileSync(path.join(__dirname, 'script.js'), 'utf8');

const replacements = {
    '[[TURSO_DATABASE_URL]]': process.env.TURSO_DATABASE_URL,
    '[[TURSO_AUTH_TOKEN]]': process.env.TURSO_AUTH_TOKEN,
    '[[GEMINI_API_KEY]]': process.env.GEMINI_API_KEY
};

let replaceCount = 0;
Object.entries(replacements).forEach(([placeholder, value]) => {
    if (value) {
        // Escape special characters for regex if needed, but here simple split/join is safer
        scriptContent = scriptContent.split(placeholder).join(value);
        console.log(`Injected variable for ${placeholder}`);
        replaceCount++;
    } else {
        console.warn(`Warning: Environment variable for ${placeholder} is missing!`);
    }
});

fs.writeFileSync(path.join(distDir, 'script.js'), scriptContent);
console.log(`Successfully processed script.js and saved to dist/ (${replaceCount} replacements)`);
