const fs = require('fs');
const path = require('path');

// File to store last greeting timestamps
const GREETING_FILE = './data/greetings.json';

// Ensure greetings file exists
if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data', { recursive: true });
}
if (!fs.existsSync(GREETING_FILE)) {
    fs.writeFileSync(GREETING_FILE, JSON.stringify({}));
}

async function handleGreeting(sock, chatId, message, userMessage) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        
        // Don't respond to bot's own messages
        if (message.key.fromMe) {
            return false;
        }

        // Don't respond to very short random messages (1-2 words that aren't proper greetings)
        const wordCount = userMessage.split(/\s+/).length;
        if (wordCount <= 2 && !isProperGreeting(userMessage)) {
            return false;
        }

        // Don't respond to messages that are just file captions or random text
        if (isRandomText(userMessage)) {
            return false;
        }

        const greetings = [
            'hi', 'hello', 'hey', 'hola', 'namaste', 'salam', 
            'good morning', 'good afternoon', 'good evening', 'gm', 'ga', 'ge',
            'morning', 'afternoon', 'evening'
        ];

        const isGreeting = greetings.some(greet => {
            const regex = new RegExp(`\\b${greet}\\b`, 'i');
            return regex.test(userMessage);
        });

        if (!isGreeting) {
            return false;
        }

        // Read greeting data
        let greetingData = {};
        try {
            greetingData = JSON.parse(fs.readFileSync(GREETING_FILE));
        } catch (error) {
            console.error('Error reading greeting data:', error);
        }

        const now = Date.now();
        const cooldownTime = 5 * 60 * 1000; // 5 minutes cooldown

        // Check if user has greeted recently
        if (greetingData[senderId] && (now - greetingData[senderId] < cooldownTime)) {
            return false; // Silently ignore if within cooldown
        }

        // Update last greeting time
        greetingData[senderId] = now;
        try {
            fs.writeFileSync(GREETING_FILE, JSON.stringify(greetingData, null, 2));
        } catch (error) {
            console.error('Error saving greeting data:', error);
        }

        // Stylish responses without channel link
        const responses = [
            "✨ *Hi there!* ✨\n\nI'm *Benzo Bot* 🤖\nHow are you doing today? How can I assist you?",
            "🌟 *Hello!* 🌟\n\nThis is *Benzo Bot* at your service! 💫\nWhat can I help you with today?",
            "👋 *Hey!* 👋\n\nI'm *Benzo Bot* - your friendly assistant! 🚀\nHow's your day going? Need any help?",
            "💫 *Greetings!* 💫\n\nYou've reached *Benzo Bot*! 🤗\nHow are you? What can I do for you today?",
            "🎯 *Hello there!* 🎯\n\n*Benzo Bot* here! Ready to help! 💪\nHow can I assist you today?"
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        await sock.sendMessage(chatId, {
            text: randomResponse
        }, { quoted: message });
        
        return true;
    } catch (error) {
        console.error('Error in greeting handler:', error);
        return false;
    }
}

// Helper function to check if it's a proper greeting
function isProperGreeting(message) {
    const properGreetings = [
        'hi', 'hello', 'hey', 'hola', 'namaste', 'salam',
        'good morning', 'good afternoon', 'good evening',
        'gm', 'ga', 'ge', 'morning', 'afternoon', 'evening'
    ];
    
    return properGreetings.some(greet => {
        const regex = new RegExp(`^${greet}$`, 'i');
        return regex.test(message.trim());
    });
}

// Helper function to detect random text that shouldn't trigger greetings
function isRandomText(message) {
    const randomPatterns = [
        // File captions or random words
        /^\d+$/i, // Just numbers
        /^[a-z]{1,3}$/i, // Very short random letters
        /^(ok|yes|no|maybe|please|thanks|thank you)$/i, // Common short responses
        /^.{1,2}$/i, // Very short messages (1-2 characters)
        /^[^a-z0-9]+$/i, // Only special characters
        /^(slide|higo|side|utaona|see|more|ava|something|orange|checki|twongeo|jioni|outo|typing|cif)$/i // Your example random words
    ];
    
    return randomPatterns.some(pattern => pattern.test(message.trim()));
}

module.exports = { handleGreeting };