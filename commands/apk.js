const axios = require('axios');

async function apkCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const appName = text.split(' ').slice(1).join(' ').trim();

        if (!appName) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide an app name to search!\n\n*Example:* .apk WhatsApp' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: `⏳ Searching for ${appName}...` }, { quoted: message });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${appName}/limit=1`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.datalist || !data.datalist.list.length) {
            await sock.sendMessage(chatId, { 
                text: '⚠️ No results found for the given app name.' 
            }, { quoted: message });
            return;
        }

        const app = data.datalist.list[0];
        const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

        const caption = `╭━━━〔 *APK DOWNLOADER* 〕━━━┈⊷\n`
            + `┃ 📦 *Name:* ${app.name}\n`
            + `┃ 🏋 *Size:* ${appSize} MB\n`
            + `┃ 📦 *Package:* ${app.package}\n`
            + `┃ 📅 *Updated:* ${app.updated}\n`
            + `┃ 👨‍💻 *Developer:* ${app.developer.name}\n`
            + `╰━━━━━━━━━━━━━━━┈⊷\n\n`
            + `⏳ Downloading...`;

        await sock.sendMessage(chatId, { text: caption }, { quoted: message });

        await sock.sendMessage(chatId, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: 'application/vnd.android.package-archive',
            caption: `✅ *${app.name}* downloaded!\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('APK Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = apkCommand;