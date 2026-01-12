const fetch = require('node-fetch');

async function gitCloneCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || 
                     message.message?.extendedTextMessage?.text || '';
        const url = text.split(' ').slice(1).join(' ').trim();

        if (!url || !/^(https:\/\/)?github\.com\/.+/.test(url)) {
            await sock.sendMessage(chatId, { 
                text: '❌ Please provide a valid GitHub repository URL!\n\n*Example:* .gitclone https://github.com/username/repository' 
            }, { quoted: message });
            return;
        }

        const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
        const match = url.match(regex);

        if (!match) {
            await sock.sendMessage(chatId, { text: '❌ Invalid GitHub URL!' }, { quoted: message });
            return;
        }

        const [, username, repo] = match;
        const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

        await sock.sendMessage(chatId, { 
            text: `📥 *Downloading repository...*\n\n*Repository:* ${username}/${repo}\n\nPlease wait...` 
        }, { quoted: message });

        // Check if repository exists
        const response = await fetch(zipUrl, { method: 'HEAD' });
        if (!response.ok) {
            await sock.sendMessage(chatId, { text: '❌ Repository not found!' }, { quoted: message });
            return;
        }

        const contentDisposition = response.headers.get('content-disposition');
        const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;

        await sock.sendMessage(chatId, {
            document: { url: zipUrl },
            fileName: fileName,
            mimetype: 'application/zip',
            caption: `📦 *${username}/${repo}*\n\n> *_Downloaded by Shanu Bot MD_*`
        }, { quoted: message });

    } catch (error) {
        console.error('GitClone Error:', error);
        await sock.sendMessage(chatId, { 
            text: `❌ Error: ${error.message}` 
        }, { quoted: message });
    }
}

module.exports = gitCloneCommand;