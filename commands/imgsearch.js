const axios = require('axios');

async function imgSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(chatId, { 
                text: '🖼️ Please provide a search query!\n\n*Example:* .img cute cats' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { 
            text: `🔍 Searching images for "${query}"...` 
        }, { quoted: message });

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length) {
            await sock.sendMessage(chatId, { 
                text: '❌ No images found. Try different keywords!' 
            }, { quoted: message });
            return;
        }

        const results = response.data.results;
        // Get 5 random images
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await sock.sendMessage(chatId, {
                image: { url: imageUrl },
                caption: `📷 *Result for:* ${query}\n\n> *_Downloaded by Shanu Bot MD_*`
            }, { quoted: message });

            // Add delay between sends
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('Image Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message || 'Failed to fetch images'}` 
        }, { quoted: message });
    }
}

module.exports = imgSearchCommand;