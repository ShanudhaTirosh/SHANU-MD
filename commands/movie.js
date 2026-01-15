const fetch = require('node-fetch');

const API_KEY = 'prabath_sk_077fb699e307ba097affa7be3ea1eefa851a78d6';

// Store movie search results
if (!global.movieSearchCache) global.movieSearchCache = {};

async function movieCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { 
                text: '❌ Enter a movie name!\n\n*Example:* .movie Avengers' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '🔍 Searching movies...' }, { quoted: message });

        let results = [];
        let count = 1;

        // Search function
        async function search(site, api) {
            try {
                const res = await fetch(api, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY
                    },
                    body: JSON.stringify({ query: searchQuery })
                });

                const data = await res.json();
                if (!data.results) return;

                data.results.slice(0, 5).forEach(r => {
                    results.push({
                        id: count++,
                        title: r.title,
                        url: r.url,
                        site
                    });
                });
            } catch (e) {
                console.log(`${site} search failed:`, e.message);
            }
        }

        // Search all platforms
        await Promise.all([
            search("Baiscope", "https://api.prabath.top/api/v1/baiscope/search"),
            search("Cinesubz", "https://api.prabath.top/api/v1/cinesubz/search"),
            search("Sinhalasub", "https://api.prabath.top/api/v1/sinhalasub/search"),
            search("Cineru", "https://api.prabath.top/api/v1/cineru/search")
        ]);

        if (!results.length) {
            await sock.sendMessage(chatId, { text: '❌ No results found!' }, { quoted: message });
            return;
        }

        // Store results
        global.movieSearchCache[chatId] = {
            results,
            timestamp: Date.now()
        };

        let msg = `🎬 *Movie Results for:* ${searchQuery}\n\n`;
        results.forEach(r => {
            msg += `*${r.id}.* ${r.title}\n📌 ${r.site}\n\n`;
        });
        msg += `Reply with the number to download (e.g., 1 or .1)\n\n`;
        msg += `> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, { text: msg }, { quoted: message });

        // Auto-cleanup after 10 minutes
        setTimeout(() => {
            delete global.movieSearchCache[chatId];
        }, 10 * 60 * 1000);

    } catch (error) {
        console.error('Movie Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Movie selection handler
async function handleMovieSelection(sock, chatId, message, selection) {
    try {
        const cache = global.movieSearchCache[chatId];
        if (!cache) return false;

        const index = parseInt(selection);
        const selected = cache.results.find(x => x.id === index);

        if (!selected) {
            await sock.sendMessage(chatId, { text: '❌ Invalid number!' }, { quoted: message });
            return true;
        }

        let apiMap = {
            Baiscope: "https://api.prabath.top/api/v1/baiscope/movie",
            Cinesubz: "https://api.prabath.top/api/v1/cinesubz/movie",
            Sinhalasub: "https://api.prabath.top/api/v1/sinhalasub/movie",
            Cineru: "https://api.prabath.top/api/v1/cineru/movie"
        };

        let api = apiMap[selected.site];
        if (!api) {
            await sock.sendMessage(chatId, { text: '❌ Unsupported source!' }, { quoted: message });
            return true;
        }

        await sock.sendMessage(chatId, { 
            text: `⏳ Downloading *${selected.title}* from ${selected.site}...` 
        }, { quoted: message });

        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ url: selected.url })
        });

        const data = await res.json();
        if (!data.download) {
            await sock.sendMessage(chatId, { text: '❌ Download failed!' }, { quoted: message });
            return true;
        }

        await sock.sendMessage(chatId, {
            document: { url: data.download },
            mimetype: 'video/mp4',
            fileName: `${selected.title}.mp4`,
            caption: `🎬 *${selected.title}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

        delete global.movieSearchCache[chatId];
        return true;

    } catch (error) {
        console.error('Movie Download Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Download failed: ${error.message}` 
        }, { quoted: message });
        return true;
    }
}

module.exports = { 
    movieCommand, 
    handleMovieSelection 
};