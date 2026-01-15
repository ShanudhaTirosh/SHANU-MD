const fetch = require('node-fetch');

const API_KEY = 'prabath_sk_077fb699e307ba097affa7be3ea1eefa851a78d6';

// Sinhalasub Search Command
async function sinhalasubSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { 
                text: '❌ Enter a movie/series name!\n\n*Example:* .sinsearch Avengers' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '🔍 Searching Sinhalasub...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/sinhalasub/search', {
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

        let msg = `🇱🇰 *Sinhalasub Search Results*\n\n📝 Query: *${searchQuery}*\n\n`;
        data.results.slice(0, 10).forEach((v, i) => {
            msg += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
        });
        msg += `Use *.sinmovie <url>* to download movie\n`;
        msg += `Use *.sinepisode <url>* to download episode\n\n`;
        msg += `> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, { text: msg }, { quoted: message });

    } catch (error) {
        console.error('Sinhalasub Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Sinhalasub Movie Download
async function sinhalasubMovieCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide movie URL!\n\n*Example:* .sinmovie https://sinhalasub.lk/movie/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading from Sinhalasub...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/sinhalasub/movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ url: url })
        });

        const data = await res.json();
        if (!data.download) {
            await sock.sendMessage(chatId, { text: '❌ Download failed!' }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            document: { url: data.download },
            mimetype: 'video/mp4',
            fileName: `${data.title || 'Sinhalasub_Movie'}.mp4`,
            caption: `🎬 *${data.title || 'Movie'}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Sinhalasub Movie Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Sinhalasub Episode Download
async function sinhalasubEpisodeCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide episode URL!\n\n*Example:* .sinepisode https://sinhalasub.lk/episode/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading episode...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/sinhalasub/episode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ url: url })
        });

        const data = await res.json();
        if (!data.download) {
            await sock.sendMessage(chatId, { text: '❌ Download failed!' }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            document: { url: data.download },
            mimetype: 'video/mp4',
            fileName: `${data.title || 'Episode'}.mp4`,
            caption: `📺 *${data.title || 'Episode'}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Sinhalasub Episode Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = {
    sinhalasubSearchCommand,
    sinhalasubMovieCommand,
    sinhalasubEpisodeCommand
};