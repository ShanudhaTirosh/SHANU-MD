const axios = require('axios');

async function npmSearchCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const packageName = text.split(' ').slice(1).join(' ').trim();

        if (!packageName) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide an npm package name!\n\n*Example:* .npm express' 
            }, { quoted: message });
            return;
        }

        await sock.sendMessage(chatId, { text: `🔍 Searching npm for "${packageName}"...` }, { quoted: message });

        const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;
        const response = await axios.get(apiUrl);

        if (response.status !== 200) {
            await sock.sendMessage(chatId, { text: '❌ Package not found!' }, { quoted: message });
            return;
        }

        const packageData = response.data;
        const latestVersion = packageData['dist-tags'].latest;
        const description = packageData.description || 'No description available.';
        const npmUrl = `https://www.npmjs.com/package/${packageName}`;
        const license = packageData.license || 'Unknown';
        const repository = packageData.repository ? packageData.repository.url : 'Not available';

        const messageText = `📦 *NPM PACKAGE SEARCH*\n\n`
            + `*🔰 Package:* ${packageName}\n`
            + `*📄 Description:* ${description}\n`
            + `*⏸️ Latest Version:* ${latestVersion}\n`
            + `*🪪 License:* ${license}\n`
            + `*🪩 Repository:* ${repository}\n`
            + `*🔗 NPM URL:* ${npmUrl}\n\n`
            + `> *_Shanu Bot MD_*`;

        await sock.sendMessage(chatId, { text: messageText }, { quoted: message });

    } catch (error) {
        console.error('NPM Search Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = npmSearchCommand;