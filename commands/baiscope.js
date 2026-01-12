const fetch = require('node-fetch');

const API_KEY = 'prabath_sk_1d7a31d1891abfc40e0d09aa9c6ad37d3b7717a0';

// Baiscope Search Command
async function baiscopeSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { 
                text: '❌ Enter a movie name!\n\n*Example:* .baisearch Avengers' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '🔍 Searching Baiscope...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/baiscope/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ query: searchQuery })
        });

        const data = await res.json();
        if (!data.results?.length) {
            await sock.sendMessage(chatId, { text: '❌ No results found!' }, { quoted: message });
            return;
        }

        let msg = `🎬 *Baiscope Search Results*\n\n📝 Query: *${searchQuery}*\n\n`;
        data.results.slice(0, 10).forEach((v, i) => {
            msg += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
        });
        msg += `Use *.baimovie <url>* to download\n\n`;
        msg += `> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, { text: msg }, { quoted: message });

    } catch (error) {
        console.error('Baiscope Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Baiscope Movie Download
async function baiscopeMovieCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide movie URL!\n\n*Example:* .baimovie https://baiscope.lk/movie/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading from Baiscope...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/baiscope/movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ url: url })
        });

        const data = await res.json();
        if (!data.download) {
            await sock.sendMessage(chatId, { text: '❌ Movie not found!' }, { quoted: message });
            return;
        }

        let caption = `🎬 *${data.title}*\n\n`;
        if (data.year) caption += `📅 ${data.year}\n`;
        if (data.quality) caption += `🎞 Quality: ${data.quality}\n`;
        caption += `\n> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, {
            document: { url: data.download },
            mimetype: 'video/mp4',
            fileName: `${data.title || 'Baiscope_Movie'}.mp4`,
            caption: caption
        }, { quoted: message });

    } catch (error) {
        console.error('Baiscope Movie Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = {
    baiscopeSearchCommand,
    baiscopeMovieCommand
};