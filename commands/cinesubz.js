const fetch = require('node-fetch');

const API_KEY = 'prabath_sk_1d7a31d1891abfc40e0d09aa9c6ad37d3b7717a0';

// Cinesubz Search Command
async function cinesubzSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { 
                text: '❌ Enter a movie/series name!\n\n*Example:* .cinesearch Breaking Bad' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '🔍 Searching Cinesubz...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/cinesubz/search', {
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

        let msg = `🎞️ *Cinesubz Search Results*\n\n📝 Query: *${searchQuery}*\n\n`;
        data.results.slice(0, 10).forEach((v, i) => {
            msg += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
        });
        msg += `Use *.cinemovie <url>* for movies\n`;
        msg += `Use *.cineepisode <url>* for episodes\n\n`;
        msg += `> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, { text: msg }, { quoted: message });

    } catch (error) {
        console.error('Cinesubz Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Cinesubz Movie Download
async function cinesubzMovieCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide movie URL!\n\n*Example:* .cinemovie https://cinesubz.co/movie/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading from Cinesubz...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/cinesubz/movie', {
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
            fileName: `${data.title || 'Cinesubz_Movie'}.mp4`,
            caption: `🎬 *${data.title || 'Movie'}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Cinesubz Movie Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Cinesubz Episode Download
async function cinesubzEpisodeCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide episode URL!\n\n*Example:* .cineepisode https://cinesubz.co/episode/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading episode...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/cinesubz/episode', {
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
        console.error('Cinesubz Episode Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = {
    cinesubzSearchCommand,
    cinesubzMovieCommand,
    cinesubzEpisodeCommand
};