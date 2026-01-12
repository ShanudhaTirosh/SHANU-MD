const fetch = require('node-fetch');

async function tiktokSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a search query!\n\n*Example:* .tiktoksearch dance' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: `🔎 Searching TikTok for: *${query}*\n\nPlease wait...` 
        }, { quoted: message });

        const response = await fetch(
            `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (!data || !data.data || data.data.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ No results found for your query. Try different keywords!' 
            }, { quoted: message });
            return;
        }

        // Get up to 7 random results
        const results = data.data.slice(0, 7).sort(() => Math.random() - 0.5);

        for (const video of results) {
            const caption = `🌸 *TikTok Video Result*\n\n`
                + `*• Title:* ${video.title}\n`
                + `*• Author:* ${video.author || 'Unknown'}\n`
                + `*• Duration:* ${video.duration || 'Unknown'}\n`
                + `*• URL:* ${video.link}\n\n`
                + `> *_Downloaded by ShanuBot MD_*`;

            if (video.nowm) {
                await sock.sendMessage(chatId, {
                    video: { url: video.nowm },
                    caption: caption
                }, { quoted: message });

                // Add delay between videos
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                await sock.sendMessage(chatId, { 
                    text: `❌ Failed to retrieve video for *"${video.title}"*` 
                }, { quoted: message });
            }
        }

    } catch (error) {
        console.error('TikTok Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = tiktokSearchCommand;