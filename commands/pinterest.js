const axios = require('axios');

async function pinterestCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.startsWith('http')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid Pinterest URL!\n\n*Example:* .pindl https://pin.it/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Downloading from Pinterest...' }, { quoted: message });

        const response = await axios.get(
            `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(url)}`
        );

        if (!response.data.success) {
            await sock.sendMessage(chatId, { text: '❌ Failed to fetch data from Pinterest.' }, { quoted: message });
            return;
        }

        const media = response.data.result.media;
        const title = response.data.result.title || 'Pinterest Media';
        const description = response.data.result.description || 'No description available';

        // Select best quality
        const videoUrl = media.find(item => item.type.includes('720p'))?.download_url || media[0].download_url;
        const imageUrl = media.find(item => item.type === 'Thumbnail')?.download_url;

        const caption = `🎬 *${title}*\n\n${description}\n\n> *_Downloaded by Shanu Bot MD_*`;

        // Send video or image
        if (videoUrl && media[0].type.includes('video')) {
            await sock.sendMessage(chatId, {
                video: { url: videoUrl },
                caption: caption
            }, { quoted: message });
        } else if (imageUrl) {
            await sock.sendMessage(chatId, {
                image: { url: imageUrl },
                caption: caption
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: '❌ No media found!' }, { quoted: message });
        }

    } catch (error) {
        console.error('Pinterest Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = pinterestCommand;