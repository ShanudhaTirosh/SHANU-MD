const fetch = require('node-fetch');

const API_KEY = 'prabath_sk_077fb699e307ba097affa7be3ea1eefa851a78d6';

async function yt2Command(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.match(/(youtube\.com|youtu\.be)/)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide a valid YouTube URL!\n\n*Example:* .yt2 https://youtu.be/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading YouTube video...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/dl/youtube', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ url: url })
        });

        const data = await res.json();
        if (!data.download) {
            await sock.sendMessage(chatId, { text: '❌ Failed to download!' }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            video: { url: data.download },
            mimetype: 'video/mp4',
            caption: `🎬 *YouTube Video*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('YT2 Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = yt2Command;