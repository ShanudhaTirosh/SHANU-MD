const axios = require('axios');

async function facebookCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.includes('facebook.com')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a Facebook video URL!\n\n*Example:* .facebook https://facebook.com/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading Facebook video...' }, { quoted: message });

        const response = await axios.get(`https://nethu-api-ashy.vercel.app/download/fbdown?url=${encodeURIComponent(url)}`);
        const data = response.data;

        if (!data.result || (!data.result.sd && !data.result.hd)) {
            await sock.sendMessage(chatId, { text: "❌ I couldn't find the video!" }, { quoted: message });
            return;
        }

        let caption = `🎥 *Facebook Video*\n\n📝 Title: Facebook video\n🔗 URL: ${url}\n\n> *_Downloaded by Shanu Bot MD_*`;

        // Send thumbnail if available
        if (data.result.thumb) {
            await sock.sendMessage(chatId, {
                image: { url: data.result.thumb },
                caption: caption
            }, { quoted: message });
        }

        // Send SD quality
        if (data.result.sd) {
            await sock.sendMessage(chatId, {
                video: { url: data.result.sd },
                mimetype: 'video/mp4',
                caption: '*SD Quality*\n\n> *_Downloaded by Shanu Bot MD_*'
            }, { quoted: message });
        }

        // Send HD quality
        if (data.result.hd) {
            await sock.sendMessage(chatId, {
                video: { url: data.result.hd },
                mimetype: 'video/mp4',
                caption: '*HD Quality*\n\n> *_Downloaded by Shanu Bot MD_*'
            }, { quoted: message });
        }

    } catch (error) {
        console.error('Facebook Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = facebookCommand;