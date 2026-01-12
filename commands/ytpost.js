const axios = require('axios');

async function ytPostCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a YouTube community post URL!\n\n*Example:* .ytpost https://youtube.com/post/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Fetching YouTube post...' }, { quoted: message });

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await sock.sendMessage(chatId, { 
                text: '❌ Failed to fetch the community post. Please check the URL!' 
            }, { quoted: message });
            return;
        }

        const post = data.data;
        let caption = `📢 *YouTube Community Post* 📢\n\n📜 *Content:* ${post.content}\n\n> *_Downloaded by Shanu Bot MD_*`;

        if (post.images && post.images.length > 0) {
            for (const img of post.images) {
                await sock.sendMessage(chatId, {
                    image: { url: img },
                    caption: caption
                }, { quoted: message });
                caption = ''; // Only add caption once
            }
        } else {
            await sock.sendMessage(chatId, { text: caption }, { quoted: message });
        }

    } catch (error) {
        console.error('YTPost Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = ytPostCommand;