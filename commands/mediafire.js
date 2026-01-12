const axios = require('axios');

async function mediafireCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.includes('mediafire.com')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid MediaFire link!\n\n*Example:* .mediafire https://www.mediafire.com/file/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Fetching MediaFire file...' }, { quoted: message });

        const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${url}`);
        const data = response.data;

        if (!data || !data.status || !data.result || !data.result.dl_link) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.' 
            }, { quoted: message });
            return;
        }

        const { dl_link, fileName, fileType } = data.result;
        const file_name = fileName || 'mediafire_download';
        const mime_type = fileType || 'application/octet-stream';

        const caption = `╭━━━〔 *MEDIAFIRE DOWNLOADER* 〕━━━⊷\n`
            + `┃▸ *File Name:* ${file_name}\n`
            + `┃▸ *File Type:* ${mime_type}\n`
            + `╰━━━⪼\n\n`
            + `📥 Downloading your file...`;

        await sock.sendMessage(chatId, { text: caption }, { quoted: message });

        await sock.sendMessage(chatId, {
            document: { url: dl_link },
            mimetype: mime_type,
            fileName: file_name,
            caption: `✅ *${file_name}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('MediaFire Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = mediafireCommand;