const axios = require('axios');

async function gdriveCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.includes('drive.google.com')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid Google Drive link!\n\n*Example:* .gdrive https://drive.google.com/file/d/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Fetching Google Drive file...' }, { quoted: message });

        const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${url}&apikey=mnp3grlZ`;
        const response = await axios.get(apiUrl);
        const downloadUrl = response.data.result.downloadUrl;

        if (!downloadUrl) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ No download URL found. Please check the link and make sure the file is publicly accessible.' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, {
            document: { url: downloadUrl },
            mimetype: response.data.result.mimetype || 'application/octet-stream',
            fileName: response.data.result.fileName || 'gdrive_download',
            caption: `✅ *Google Drive File Downloaded*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('Google Drive Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = gdriveCommand;