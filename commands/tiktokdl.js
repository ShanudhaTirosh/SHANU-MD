const axios = require('axios');

async function tiktokDlCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.includes('tiktok.com')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid TikTok video link!\n\n*Example:* .tiktok https://tiktok.com/@user/video/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading TikTok video...' }, { quoted: message });

        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await sock.sendMessage(chatId, { text: '❌ Failed to fetch TikTok video!' }, { quoted: message });
            return;
        }

        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === 'video')?.org;

        if (!videoUrl) {
            await sock.sendMessage(chatId, { text: '❌ Video URL not found!' }, { quoted: message });
            return;
        }

        const caption = `🎵 *TikTok Video* 🎵\n\n`
            + `👤 *User:* ${author.nickname} (@${author.username})\n`
            + `📖 *Title:* ${title}\n`
            + `👍 *Likes:* ${like}\n`
            + `💬 *Comments:* ${comment}\n`
            + `🔁 *Shares:* ${share}\n\n`
            + `> *_Downloaded by Shanu Bot MD_*`;

        await sock.sendMessage(chatId, {
            video: { url: videoUrl },
            caption: caption
        }, { quoted: message });

    } catch (error) {
        console.error('TikTok Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = tiktokDlCommand;