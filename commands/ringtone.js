const axios = require('axios');

async function ringtoneCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a search query!\n\n*Example:* .ringtone Suna' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: `🎵 Searching ringtones for "${query}"...` }, { quoted: message });

        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

        if (!data.status || !data.result || data.result.length === 0) {
            await sock.sendMessage(chatId, { 
                text: '❌ No ringtones found. Try a different keyword!' 
            }, { quoted: message });
            return;
        }

        const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

        await sock.sendMessage(chatId, {
            audio: { url: randomRingtone.dl_link },
            mimetype: 'audio/mpeg',
            fileName: `${randomRingtone.title}.mp3`,
            caption: `🎵 *${randomRingtone.title}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Ringtone Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = ringtoneCommand;