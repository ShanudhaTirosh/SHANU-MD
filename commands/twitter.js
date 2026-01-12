const axios = require('axios');

async function twitterCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !url.startsWith('https://')) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid Twitter/X URL!\n\n*Example:* .twitter https://twitter.com/user/status/xxxxx' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: '⏳ Fetching Twitter video...' }, { quoted: message });

        const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${url}`);
        const data = response.data;

        if (!data || !data.status || !data.result) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ Failed to retrieve Twitter video. Please check the link and try again.' 
            }, { quoted: message });
            return;
        }

        const { desc, thumb, video_sd, video_hd } = data.result;

        const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n`
            + `┃▸ *Description:* ${desc || "No description"}\n`
            + `╰━━━⪼\n\n`
            + `📹 *Download Options:*\n`
            + `1️⃣  SD Quality\n`
            + `2️⃣  HD Quality\n`
            + `3️⃣  Audio Only\n\n`
            + `📌 Reply with 1, 2, or 3`;

        const sentMsg = await sock.sendMessage(chatId, {
            image: { url: thumb },
            caption: caption
        }, { quoted: message });

        const messageID = sentMsg.key.id;

        // Store selection data
        if (!global.twitterDownloads) global.twitterDownloads = {};
        global.twitterDownloads[chatId] = {
            messageID,
            video_sd,
            video_hd,
            timestamp: Date.now()
        };

        // Auto-cleanup after 5 minutes
        setTimeout(() => {
            delete global.twitterDownloads[chatId];
        }, 5 * 60 * 1000);

    } catch (error) {
        console.error('Twitter Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

// Twitter selection handler
async function handleTwitterSelection(sock, chatId, message, choice) {
    try {
        const data = global.twitterDownloads[chatId];
        if (!data) return false;

        const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.stanzaId;
        if (quotedMsg !== data.messageID) return false;

        switch (choice) {
            case '1':
                await sock.sendMessage(chatId, {
                    video: { url: data.video_sd },
                    caption: '📥 *Downloaded in SD Quality*\n\n> *_Downloaded by Shanu Bot MD_*'
                }, { quoted: message });
                break;

            case '2':
                await sock.sendMessage(chatId, {
                    video: { url: data.video_hd },
                    caption: '📥 *Downloaded in HD Quality*\n\n> *_Downloaded by Shanu Bot MD_*'
                }, { quoted: message });
                break;

            case '3':
                await sock.sendMessage(chatId, {
                    audio: { url: data.video_sd },
                    mimetype: 'audio/mpeg'
                }, { quoted: message });
                break;

            default:
                return false;
        }

        delete global.twitterDownloads[chatId];
        return true;

    } catch (error) {
        console.error('Twitter Selection Error:', error);
        return false;
    }
}

module.exports = { 
    twitterCommand, 
    handleTwitterSelection 
};