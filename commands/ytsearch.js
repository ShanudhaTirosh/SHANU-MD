const yts = require('yt-search');

// Helper functions
function calculateRelevance(video, query) {
    const queryLower = query.toLowerCase();
    const titleLower = video.title.toLowerCase();
    const authorLower = video.author.name.toLowerCase();
    
    let score = 0;
    if (titleLower === queryLower) score += 100;
    if (titleLower.startsWith(queryLower)) score += 50;
    
    const queryWords = queryLower.split(' ');
    const titleWords = titleLower.split(' ');
    const matchingWords = queryWords.filter(word => titleWords.includes(word));
    score += (matchingWords.length / queryWords.length) * 30;
    
    if (video.author.verified) score += 20;
    const viewScore = Math.log10(video.views + 1) * 2;
    score += viewScore;
    
    return score;
}

function formatViews(views) {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
}

async function ytsCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const searchQuery = text.split(' ').slice(1).join(' ').trim();

        if (!searchQuery) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a search query!\n\n*Example:* .yts shape of you' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '🔍 Searching YouTube...' }, { quoted: message });

        const search = await yts(searchQuery);
        if (!search.videos.length) {
            await sock.sendMessage(chatId, { text: '❌ No results found!' }, { quoted: message });
            return;
        }

        // Calculate relevance scores and sort
        const rankedVideos = search.videos
            .slice(0, 10)
            .map(video => ({
                ...video,
                relevanceScore: calculateRelevance(video, searchQuery)
            }))
            .sort((a, b) => b.relevanceScore - a.relevanceScore);

        let messageText = `🔎 *YOUTUBE SEARCH RESULTS*\n\n`;
        messageText += `📝 Query: *${searchQuery}*\n`;
        messageText += `✨ Showing top ${rankedVideos.length} results\n\n`;
        messageText += `━━━━━━━━━━━━━━━━━━━\n\n`;

        rankedVideos.forEach((video, index) => {
            const badge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '▫️';
            messageText += `${badge} *${index + 1}. ${video.title}*\n`;
            messageText += `👤 ${video.author.name}${video.author.verified ? ' ✓' : ''}\n`;
            messageText += `⏱️ ${video.timestamp} | 👁️ ${formatViews(video.views)}\n`;
            messageText += `🔗 ${video.url}\n\n`;
        });

        messageText += `━━━━━━━━━━━━━━━━━━━\n\n`;
        messageText += `📥 *To download:*\n`;
        messageText += `• Audio: *.song <number>*\n`;
        messageText += `• Video: *.video <number>*\n\n`;
        messageText += `*Example:* .song 1`;

        // Store search results
        if (!global.ytSearchCache) global.ytSearchCache = {};
        global.ytSearchCache[chatId] = {
            results: rankedVideos,
            timestamp: Date.now(),
            query: searchQuery
        };

        await sock.sendMessage(chatId, {
            image: { url: rankedVideos[0].thumbnail },
            caption: messageText
        }, { quoted: message });

    } catch (error) {
        console.error('YTS Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = ytsCommand;