const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const os = require('os');

function runtime(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

async function helpCommand(sock, chatId, message) {
    const helpMessage = `
💊 *Benzo-MD*

*Version:* ${settings.version || '2.2.0'}
*Runtime:* ${runtime(process.uptime())}
*Platform:* ${os.platform()}
*Memory:* ${(process.memoryUsage().heapUsed / (1024 * 1024)).toFixed(2)}MB
*Creator:* ${settings.botOwner || 'Amon'}

*📁 AVAILABLE COMMANDS*

┌─「 🛠️ *GENERAL* 」
│ • .help / .menu
│ • .ping
│ • .alive
│ • .tts <text>
│ • .owner
│ • .joke
│ • .quote
│ • .fact
│ • .weather <city>
│ • .news
│ • .attp <text>
│ • .lyrics <song_title>
│ • .8ball <question>
│ • .groupinfo
│ • .staff / .admins
│ • .vv
│ • .trt <text> <lang>
│ • .ss <link>
│ • .jid
│ • .url
└─

┌─「 🔧 *ADMIN* 」
│ • .ban @user
│ • .promote @user
│ • .demote @user
│ • .mute <minutes>
│ • .unmute
│ • .delete / .del
│ • .kick @user
│ • .warnings @user
│ • .warn @user
│ • .antilink
│ • .antibadword
│ • .clear
│ • .tag <message>
│ • .tagall
│ • .tagnotadmin
│ • .hidetag <message>
│ • .chatbot
│ • .resetlink
│ • .antitag <on/off>
│ • .welcome <on/off>
│ • .goodbye <on/off>
│ • .setgdesc <description>
│ • .setgname <new name>
│ • .setgpp (reply to image)
└─

┌─「 👑 *OWNER* 」
│ • .mode <public/private>
│ • .clearsession
│ • .antidelete
│ • .cleartmp
│ • .update
│ • .settings
│ • .setpp <reply to image>
│ • .autoreact <on/off>
│ • .autostatus <on/off>
│ • .autostatus react <on/off>
│ • .autotyping <on/off>
│ • .autoread <on/off>
│ • .anticall <on/off>
│ • .pmblocker <on/off/status>
│ • .pmblocker setmsg <text>
│ • .setmention <reply to msg/media>
│ • .mention <on/off>
└─

┌─「 🎨 *IMAGE/STICKER* 」
│ • .blur <image>
│ • .simage <reply to sticker>
│ • .sticker <reply to image>
│ • .removebg
│ • .remini
│ • .crop <reply to image>
│ • .tgsticker <Link>
│ • .meme
│ • .take <packname>
│ • .emojimix <emj1>+<emj2>
│ • .igs <insta link>
│ • .igsc <insta link>
└─

┌─「 👩 *PIES* 」
│ • .pies <country>
│ • .china
│ • .indonesia
│ • .japan
│ • .korea
│ • .hijab
└─

┌─「 🎮 *GAME* 」
│ • .tictactoe @user
│ • .hangman
│ • .guess <letter>
│ • .trivia
│ • .answer <answer>
│ • .truth
│ • .dare
└─

┌─「 🤖 *AI* 」
│ • .gpt <question>
│ • .gemini <question>
│ • .imagine <prompt>
│ • .flux <prompt>
│ • .sora <prompt>
└─

┌─「 🎭 *FUN* 」
│ • .compliment @user
│ • .insult @user
│ • .flirt
│ • .shayari
│ • .goodnight
│ • .roseday
│ • .character @user
│ • .wasted @user
│ • .ship @user
│ • .simp @user
│ • .stupid @user [text]
└─

┌─「 ✨ *TEXTMAKER* 」
│ • .metallic <text>
│ • .ice <text>
│ • .snow <text>
│ • .impressive <text>
│ • .matrix <text>
│ • .light <text>
│ • .neon <text>
│ • .devil <text>
│ • .purple <text>
│ • .thunder <text>
│ • .leaves <text>
│ • .1917 <text>
│ • .arena <text>
│ • .hacker <text>
│ • .sand <text>
│ • .blackpink <text>
│ • .glitch <text>
│ • .fire <text>
└─

┌─「 ⬇️ *DOWNLOADER* 」
│ • .play <song_name>
│ • .song <song_name>
│ • .spotify <query>
│ • .instagram <link>
│ • .facebook <link>
│ • .tiktok <link>
│ • .video <song name>
│ • .ytmp4 <Link>
└─

┌─「 🎨 *MISC* 」
│ • .heart
│ • .horny
│ • .circle
│ • .lgbt
│ • .lolice
│ • .its-so-stupid
│ • .namecard
│ • .oogway
│ • .tweet
│ • .ytcomment
│ • .comrade
│ • .gay
│ • .glass
│ • .jail
│ • .passed
│ • .triggered
└─

┌─「 🎎 *ANIME* 」
│ • .neko
│ • .waifu
│ • .loli
│ • .nom
│ • .poke
│ • .cry
│ • .kiss
│ • .pat
│ • .hug
│ • .wink
│ • .facepalm
└─

┌─「 💻 *GITHUB* 」
│ • .git
│ • .github
│ • .sc
│ • .script
│ • .repo
└─

*📢 Stay updated with our newsletter!*`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        const audioPath = path.join(__dirname, '../assets/menu.mp3');
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363422423159626@newsletter",
                        newsletterName: settings.botName || "Benzo-MD",
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        } else {
            console.error('Bot image not found at:', imagePath);
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363422423159626@newsletter",
                        newsletterName: settings.botName || "Benzo-MD",
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        if (fs.existsSync(audioPath)) {
            try {
                await sock.sendMessage(chatId, {
                    audio: fs.readFileSync(audioPath),  
                    mimetype: 'audio/mpeg',
                    ptt: false
                });
            } catch (audioError) {
                console.error('Error sending audio:', audioError);
            }
        }

    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { 
            text: "❌ Error loading menu. Please try again later." 
        }, { quoted: message });
    }
}

module.exports = helpCommand;