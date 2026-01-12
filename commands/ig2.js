const axios = require('axios');

async function ig2Command(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.startsWith('http')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid Instagram link!\n\n*Example:* .ig2 https://instagram.com/p/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading from Instagram...' }, { quoted: message });

        const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${url}`);
        const data = response.data;

        if (!data || data.status !== 200 || !data.downloadUrl) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ Failed to fetch Instagram video. Please check the link and try again.' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            video: { url: data.downloadUrl },
            mimetype: 'video/mp4',
            caption: `📥 *Instagram Video Downloaded*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Instagram Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = ig2Command;