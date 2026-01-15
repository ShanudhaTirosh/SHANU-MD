const fetch = require('node-fetch');

const API_KEY = 'prabath_sk_077fb699e307ba097affa7be3ea1eefa851a78d6';

// Cineru Search Command
async function cineruSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { 
                text: '❌ Enter a movie/series name!\n\n*Example:* .cinsearch Avengers' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '🔍 Searching Cineru...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/cineru/search', {
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

        let msg = `🍿 *Cineru Search Results*\n\n📝 Query: *${searchQuery}*\n\n`;
        data.results.slice(0, 10).forEach((v, i) => {
            msg += `*${i + 1}.* ${v.title}\n🔗 ${v.url}\n\n`;
        });
        msg += `Use *.cinmovie <url>* for movies\n`;
        msg += `Use *.cinep <url>* for episodes\n\n`;
        msg += `> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, { text: msg }, { quoted: message });

    } catch (error) {
        console.error('Cineru Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Cineru Movie Download
async function cineruMovieCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide movie URL!\n\n*Example:* .cinmovie https://cineru.lk/movie/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading from Cineru...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/cineru/movie', {
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

        await sock.sendMessage(chatId, {
            document: { url: data.download },
            mimetype: 'video/mp4',
            fileName: `${data.title || 'Cineru_Movie'}.mp4`,
            caption: `🎬 *${data.title || 'Movie'}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Cineru Movie Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Cineru Episode Download
async function cineruEpisodeCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Provide episode URL!\n\n*Example:* .cinep https://cineru.lk/episode/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading episode...' }, { quoted: message });

        const res = await fetch('https://api.prabath.top/api/v1/cineru/episode', {
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
        console.error('Cineru Episode Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = {
    cineruSearchCommand,
    cineruMovieCommand,
    cineruEpisodeCommand
};