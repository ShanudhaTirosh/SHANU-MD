const axios = require('axios');

async function imdbCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const movieName = text.replace(/^\.imdb\s*/i, '').trim();

        if (!movieName) {
            await sock.sendMessage(chatId, { 
                text: '📽️ Please provide the name of the movie.\n\n*Example:* .imdb Iron Man' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: `🔍 Searching for ${movieName}...` }, { quoted: message });

        const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.movie) {
            await sock.sendMessage(chatId, { 
                text: '🚫 Movie not found. Please check the name and try again.' 
            }, { quoted: message });
            return;
        }

        const movie = response.data.movie;

        const caption = `🎬 *${movie.title}* (${movie.year}) ${movie.rated || ''}\n\n`
            + `⭐ *IMDb:* ${movie.imdbRating || 'N/A'} | 🍅 *Rotten Tomatoes:* ${movie.ratings.find(r => r.source === 'Rotten Tomatoes')?.value || 'N/A'}\n`
            + `💰 *Box Office:* ${movie.boxoffice || 'N/A'}\n\n`
            + `📅 *Released:* ${new Date(movie.released).toLocaleDateString()}\n`
            + `⏳ *Runtime:* ${movie.runtime}\n`
            + `🎭 *Genre:* ${movie.genres}\n\n`
            + `📝 *Plot:* ${movie.plot}\n\n`
            + `🎥 *Director:* ${movie.director}\n`
            + `✍️ *Writer:* ${movie.writer}\n`
            + `🌟 *Actors:* ${movie.actors}\n\n`
            + `🌍 *Country:* ${movie.country}\n`
            + `🗣️ *Language:* ${movie.languages}\n`
            + `🏆 *Awards:* ${movie.awards || 'None'}\n\n`
            + `🔗 ${movie.imdbUrl}\n\n`
            + `> *_Shanu Bot MD_*`;

        await sock.sendMessage(chatId, {
            image: { 
                url: movie.poster && movie.poster !== 'N/A' ? movie.poster : 'https://files.catbox.moe/3y5w8z.jpg'
            },
            caption: caption
        }, { quoted: message });

    } catch (error) {
        console.error('IMDb Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = imdbCommand;