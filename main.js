/**
 * SHANU - MD WhatsApp Bot
 * 
 * Copyright (c) 2026 Shanudha Tirosh (SHANU FX)
 * 
 * License:
 * This project is licensed under the MIT License.
 * You are free to use, modify, and distribute this software
 * with proper credit to the original authors.
 * 
 * Credits & Acknowledgements:
 * - Baileys WhatsApp Library by @whiskeysockets (Main Developer)
 * - Pair Code implementation by Prabath Kumara
 * - Inspired by Knight Bot
 * 
 * Bot Information:
 * - Bot Name: SHANU - MD
 * - Developer: Shanudha Tirosh (SHANU FX)
 * 
 * Version & Build Info:
 * - Version: v1.0.0
 * - Build: Stable
 * - Release Date: 2026-01-15
 * - Runtime: Node.js
 * - Library: Baileys (Multi-Device)
 * 
 * Contact Information:
 * - Email: tiroshbrot123@gmail.com
 * - GitHub: @ShanudhaTirosh
 * 
 * Disclaimer:
 * This bot is not affiliated with or endorsed by WhatsApp Inc.
 * Use at your own responsibility.
 */
 
 
 // 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours with proper cleanup
const THREE_HOURS = 3 * 60 * 60 * 1000;
let cleanupInterval = null;

function startCleanupInterval() {
    if (cleanupInterval) clearInterval(cleanupInterval);
    
    cleanupInterval = setInterval(() => {
        fs.readdir(customTemp, (err, files) => {
            if (err) return;
            for (const file of files) {
                const filePath = path.join(customTemp, file);
                fs.stat(filePath, (err, stats) => {
                    if (!err && Date.now() - stats.mtimeMs > THREE_HOURS) {
                        fs.unlink(filePath, () => {});
                    }
                });
            }
        });
        console.log('🧹 Temp folder auto-cleaned');
    }, THREE_HOURS);
}

startCleanupInterval();

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');

// Load all command imports
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');
const facebookCommand2 = require('./commands/facebook2');
const imgSearchCommand = require('./commands/imgsearch');
const ringtoneCommand = require('./commands/ringtone');
const tiktokDlCommand = require('./commands/tiktokdl');
const ytPostCommand = require('./commands/ytpost');
const gitCloneCommand = require('./commands/gitclone');
const tiktokSearchCommand = require('./commands/tiktoksearch');
const npmSearchCommand = require('./commands/npmsearch');
const { sinhalasubSearchCommand, sinhalasubMovieCommand, sinhalasubEpisodeCommand } = require('./commands/sinhalasub');
const { baiscopeSearchCommand, baiscopeMovieCommand } = require('./commands/baiscope');
const { cinesubzSearchCommand, cinesubzMovieCommand, cinesubzEpisodeCommand } = require('./commands/cinesubz');
const { cineruSearchCommand, cineruMovieCommand, cineruEpisodeCommand } = require('./commands/cineru');
const yt2Command = require('./commands/yt2');
const ytsCommand = require('./commands/ytsearch');
const { movieCommand, handleMovieSelection } = require('./commands/movie');
const pinterestCommand = require('./commands/pinterest');
const ig2Command = require('./commands/ig2');
const { twitterCommand, handleTwitterSelection } = require('./commands/twitter');
const apkCommand = require('./commands/apk');
const mediafireCommand = require('./commands/mediafire');
const gdriveCommand = require('./commands/gdrive');
const imdbCommand = require('./commands/imdb');
const channelIdCommand = require('./commands/channelid');

// Initialize messageCount.json if it doesn't exist
const messageCountPath = path.join(__dirname, 'data', 'messageCount.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
if (!fs.existsSync(messageCountPath)) {
    const defaultData = {
        isPublic: true,
        groups: {},
        users: {}
    };
    fs.writeFileSync(messageCountPath, JSON.stringify(defaultData, null, 2));
    console.log('✅ Created messageCount.json with default settings (PUBLIC mode)');
}

// Configuration cache to avoid reading file on every message
let configCache = {
    isPublic: true,
    lastLoaded: 0
};

const CONFIG_CACHE_TTL = 5000; // 5 seconds cache

function loadBotConfig() {
    const now = Date.now();
    if (now - configCache.lastLoaded > CONFIG_CACHE_TTL) {
        try {
            if (fs.existsSync(messageCountPath)) {
                const data = JSON.parse(fs.readFileSync(messageCountPath, 'utf8'));
                if (typeof data.isPublic === 'boolean') {
                    configCache.isPublic = data.isPublic;
                }
            }
            configCache.lastLoaded = now;
        } catch (error) {
            console.error('Error reading bot config:', error.message);
            configCache.isPublic = true;
        }
    }
    return configCache.isPublic;
}

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029Va90zAnIHphOuO8Msp3A";
global.ytch = "Shanu Fx";

// Channel info for messages
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363423620239927@newsletter',
            newsletterName: 'Shanu-MD Bot',
            serverMessageId: -1
        }
    }
};

// Constants for admin and owner commands
const ADMIN_COMMANDS = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.setgdesc', '.setgname', '.setgpp'];
const OWNER_COMMANDS = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.autotyping', '.autoread', '.pmblocker', '.sudo', '.anticall'];
// ============================================
// CRITICAL FIX FOR main.js
// Replace the handleMessages function starting from line ~240
// ============================================

async function handleMessages(sock, messageUpdate, printLog) {
    let chatId = null;
    
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Initialize chatId early for error handling
        chatId = message.key.remoteJid;

        // ✅ GET OWNER STATUS FIRST (before any processing)
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // ✅ UNIFIED OWNER DETECTION - Same as index.js
        const isOwnerMessage = message.key.fromMe || senderIsOwnerOrSudo || senderIsSudo;

        // Debug logging for owner detection
        console.log('🔍 AUTH CHECK:', {
            senderId: senderId.split('@')[0],
            fromMe: message.key.fromMe,
            isSudo: senderIsSudo,
            isOwnerOrSudo: senderIsOwnerOrSudo,
            finalOwnerStatus: isOwnerMessage,
            isGroup: isGroup
        });

        // ✅ READ BOT MODE
        const isPublic = loadBotConfig();
        
        // Handle autoread functionality (works for everyone)
        await handleAutoread(sock, message);

        // Store message for antidelete feature (works for everyone)
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation (works for everyone)
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            
            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, { 
                    text: '📢 *Join our Channel:*\nhttps://whatsapp.com/channel/0029VbBnGWf0rGiINbwiD83I' 
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, { 
                    text: `🔗 *Support*\n\nhttps://whatsapp.com/channel/0029VbBnGWf0rGiINbwiD83I` 
                }, { quoted: message });
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';
        
        // Check if user is banned (skip ban check for unban command and owner)
        if (isBanned(senderId) && !userMessage.startsWith('.unban') && !isOwnerMessage) {
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // Handle tic-tac-toe moves (single digits 1-9 or surrender)
        if (!userMessage.startsWith('.') && (/^[1-9]$/.test(userMessage) || userMessage === 'surrender')) {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink (skip for owner)
        if (isGroup && !isOwnerMessage) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled
        if (!isGroup && !isOwnerMessage) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    await sock.sendMessage(chatId, { 
                        text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' 
                    });
                    await new Promise(r => setTimeout(r, 1500));
                    try { 
                        await sock.updateBlockStatus(chatId, 'block'); 
                    } catch (e) {
                        console.error('Block error:', e.message);
                    }
                    return;
                }
            } catch (e) {
                console.error('PM blocker error:', e.message);
            }
        }

        // ============================================
        // NON-COMMAND MESSAGE HANDLING
        // ============================================
        if (!userMessage.startsWith('.')) {
            await handleAutotypingForMessage(sock, chatId, userMessage);

            // Group features (chatbot, tag detection, mentions)
            // These work for EVERYONE in groups (public mode)
            // In private mode, they still work in groups
            if (isGroup) {
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
                
                // Chatbot works in public mode OR for owner in private mode
                if (isPublic || isOwnerMessage) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }

        // ============================================
        // COMMAND HANDLING STARTS HERE
        // ============================================
        
        // ✅ PRIVATE MODE CHECK FOR COMMANDS
        // In PRIVATE mode:
        // - Groups: Everyone can see messages, but only owner can use commands
        // - DMs: Only owner can use commands
        if (!isPublic && !isOwnerMessage) {
            console.log('⛔ Command blocked - Private mode | User:', senderId.split('@')[0], '| Group:', isGroup);
            
            if (Math.random() < 0.3) {
                await sock.sendMessage(chatId, {
                    text: '🔒 *Bot is in PRIVATE mode*\n\nOnly the owner can use commands right now.',
                    ...channelInfo
                }, { quoted: message });
            }
            return; // Block ALL commands for non-owners in private mode
        }

        // Log command usage
        console.log(`📝 Command: ${userMessage} | ${isGroup ? 'Group' : 'Private'} | Mode: ${isPublic ? 'PUBLIC' : 'PRIVATE'} | Owner: ${isOwnerMessage ? '✅' : '❌'}`);

        // Handle movie/twitter selection (numbers 1-99)
        if (/^\.?\d+$/.test(userMessage)) {
            const selection = userMessage.replace('.', '');
            
            const movieHandled = await handleMovieSelection(sock, chatId, message, selection);
            if (movieHandled) return;
            
            const twitterHandled = await handleTwitterSelection(sock, chatId, message, selection);
            if (twitterHandled) return;
        }

        // Check if command requires admin or owner permissions
        const isAdminCommand = ADMIN_COMMANDS.some(cmd => userMessage.startsWith(cmd));
        const isOwnerCommand = OWNER_COMMANDS.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { 
                    text: 'Please make the bot an admin to use admin commands.', 
                    ...channelInfo 
                }, { quoted: message });
                return;
            }

            // Owner bypass for admin commands
            if (!isSenderAdmin && !isOwnerMessage) {
                await sock.sendMessage(chatId, {
                    text: 'Sorry, only group admins can use this command.',
                    ...channelInfo
                }, { quoted: message });
                return;
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand && !isOwnerMessage) {
            await sock.sendMessage(chatId, { 
                text: '❌ This command is only available for the owner or sudo users!',
                ...channelInfo
            }, { quoted: message });
            return;
        }

        // COMMAND EXECUTION
        let commandExecuted = false;
     
        switch (true) {
            case userMessage === '.test':
                console.log('🧪 TEST COMMAND TRIGGERED');
                await sock.sendMessage(chatId, {
                    text: '✅ *Bot is Working!*\n\n' +
                          `*Mode:* ${isPublic ? 'PUBLIC ✅' : 'PRIVATE 🔒'}\n` +
                          `*From Me:* ${message.key.fromMe ? 'Yes' : 'No'}\n` +
                          `*Sender ID:* ${senderId.split('@')[0]}\n` +
                          `*Is Sudo:* ${senderIsSudo ? 'Yes ✅' : 'No'}\n` +
                          `*Is Owner/Sudo:* ${senderIsOwnerOrSudo ? 'Yes ✅' : 'No'}\n` +
                          `*Final Owner Status:* ${isOwnerMessage ? 'Yes ✅' : 'No'}\n` +
                          `*Group:* ${isGroup ? 'Yes' : 'No'}\n` +
                          `*Command:* ${userMessage}\n\n` +
                          `All systems operational! 🚀`,
                    ...channelInfo
                }, { quoted: message });
                commandExecuted = true;
                break;

            // ... (rest of your cases from the original code)
            
            
            // INSTAGRAM COMMANDS - Check .ig2 BEFORE .ig
            case userMessage.startsWith('.ig2'):
                await ig2Command(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.igsc'):
                await igsCommand(sock, chatId, message, true);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.igs'):
                await igsCommand(sock, chatId, message, false);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || userMessage === '.ig' || userMessage.startsWith('.ig '):
                await instagramCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // STICKER COMMANDS - Check .stickertelegram BEFORE .sticker
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.simage':
                {
                    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                    if (quotedMessage?.stickerMessage) {
                        await simageCommand(sock, quotedMessage, chatId);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo }, { quoted: message });
                    }
                }
                commandExecuted = true;
                break;

            // KICK COMMAND
            case userMessage.startsWith('.kick'):
                {
                    const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                }
                commandExecuted = true;
                break;

            // MUTE COMMANDS
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                commandExecuted = true;
                break;

            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                commandExecuted = true;
                break;

            // BAN COMMANDS
            case userMessage.startsWith('.ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // HELP COMMAND
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;

            // WARNING COMMANDS
            case userMessage.startsWith('.warnings'):
                {
                    const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await warningsCommand(sock, chatId, mentionedJidListWarnings);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.warn'):
                {
                    const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                }
                commandExecuted = true;
                break;

            // TTS COMMAND
            case userMessage.startsWith('.tts'):
                {
                    const text = userMessage.slice(4).trim();
                    await ttsCommand(sock, chatId, text, message);
                }
                commandExecuted = true;
                break;

            // DELETE COMMAND
            case userMessage.startsWith('.delete') || userMessage.startsWith('.del'):
                await deleteCommand(sock, chatId, message, senderId);
                commandExecuted = true;
                break;

            // ATTP COMMAND
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // SEARCH COMMANDS
            case userMessage.startsWith('.yts'):
                await ytsCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.movie'):
                await movieCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.pindl') || userMessage.startsWith('.pin'):
                await pinterestCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.twitter') || userMessage.startsWith('.twdl'):
                await twitterCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.apk'):
                await apkCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.mediafire') || userMessage.startsWith('.mfire'):
                await mediafireCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.gdrive'):
                await gdriveCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.imdb'):
                await imdbCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cid') || userMessage.startsWith('.channelid'):
                await channelIdCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // DOWNLOAD COMMANDS
            case userMessage.startsWith('.facebook') || userMessage.startsWith('.fb') || userMessage.startsWith('.fbdl'):
                await facebookCommand2(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.img') || userMessage.startsWith('.image') || userMessage.startsWith('.googleimage'):
                await imgSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.ringtone') || userMessage.startsWith('.ring'):
                await ringtoneCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.tiktokdl') || userMessage.startsWith('.ttdl'):
                await tiktokDlCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.ytpost') || userMessage.startsWith('.ytcommunity'):
                await ytPostCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.gitclone'):
                await gitCloneCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.tiktoksearch') || userMessage.startsWith('.tiks'):
                await tiktokSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.npm'):
                await npmSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // MOVIE DOWNLOAD COMMANDS
            case userMessage.startsWith('.sinsearch'):
                await sinhalasubSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.sinmovie'):
                await sinhalasubMovieCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.sinepisode'):
                await sinhalasubEpisodeCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.baisearch') || userMessage.startsWith('.baiscope'):
                await baiscopeSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.baimovie'):
                await baiscopeMovieCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cinesearch'):
                await cinesubzSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cinemovie'):
                await cinesubzMovieCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cineepisode'):
                await cinesubzEpisodeCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cinsearch'):
                await cineruSearchCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cinmovie'):
                await cineruMovieCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.cinep'):
                await cineruEpisodeCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.yt2') || userMessage.startsWith('.ytvideo'):
                await yt2Command(sock, chatId, message);
                commandExecuted = true;
                break;

            // SETTINGS COMMAND
            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // MODE COMMAND
            case userMessage.startsWith('.mode'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    let data;
                    try {
                        data = JSON.parse(fs.readFileSync(messageCountPath, 'utf8'));
                    } catch (error) {
                        console.error('Error reading access mode:', error);
                        await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                        commandExecuted = true;
                        break;
                    }

                    const action = userMessage.split(' ')[1]?.toLowerCase();
                    if (!action) {
                        const currentMode = data.isPublic ? 'PUBLIC' : 'PRIVATE';
                        await sock.sendMessage(chatId, {
                            text: `*Current Mode:* ${currentMode}\n\n*Usage:* .mode public/private\n\n*Examples:*\n• .mode public - Allow everyone\n• .mode private - Owner only`,
                            ...channelInfo
                        }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }

                    if (action !== 'public' && action !== 'private') {
                        await sock.sendMessage(chatId, {
                            text: '*Usage:* .mode public/private\n\n*Examples:*\n• .mode public - Allow everyone\n• .mode private - Owner only',
                            ...channelInfo
                        }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }

                    try {
                        data.isPublic = action === 'public';
                        fs.writeFileSync(messageCountPath, JSON.stringify(data, null, 2));
                        
                        // Update the cache
                        configCache.isPublic = data.isPublic;
                        configCache.lastLoaded = Date.now();
                        
                        await sock.sendMessage(chatId, { text: `✅ Bot is now in *${action.toUpperCase()}* mode`, ...channelInfo });
                    } catch (error) {
                        console.error('Error updating access mode:', error);
                        await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                    }
                }
                commandExecuted = true;
                break;

            // ANTICALL COMMAND
            case userMessage.startsWith('.anticall'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;

            // PM BLOCKER COMMAND
            case userMessage.startsWith('.pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;

            // OWNER COMMAND
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                commandExecuted = true;
                break;

            // TAG COMMANDS
            case userMessage === '.tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                commandExecuted = true;
                break;

            case userMessage === '.tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.tag'):
                {
                    const messageText = rawText.slice(4).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                commandExecuted = true;
                break;

            // ANTILINK COMMAND
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                commandExecuted = true;
                break;

            // ANTITAG COMMAND
            case userMessage.startsWith('.antitag'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                commandExecuted = true;
                break;

            // FUN COMMANDS
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.weather'):
                {
                    const city = userMessage.slice(9).trim();
                    if (city) {
                        await weatherCommand(sock, chatId, message, city);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo }, { quoted: message });
                    }
                }
                commandExecuted = true;
                break;

            case userMessage === '.news':
                await newsCommand(sock, chatId);
                commandExecuted = true;
                break;

            // GAME COMMANDS
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                {
                    const tttText = userMessage.split(' ').slice(1).join(' ');
                    await tictactoeCommand(sock, chatId, senderId, tttText);
                }
                commandExecuted = true;
                break;

            case userMessage === '.surrender':
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                commandExecuted = true;
                break;

            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.guess'):
                {
                    const guessedLetter = userMessage.split(' ')[1];
                    if (guessedLetter) {
                        guessLetter(sock, chatId, guessedLetter);
                    } else {
                        sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo }, { quoted: message });
                    }
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.answer'):
                {
                    const answer = userMessage.split(' ').slice(1).join(' ');
                    if (answer) {
                        answerTrivia(sock, chatId, answer);
                    } else {
                        sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo }, { quoted: message });
                    }
                }
                commandExecuted = true;
                break;

            // INTERACTION COMMANDS
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.8ball'):
                {
                    const question = userMessage.split(' ').slice(1).join(' ');
                    await eightBallCommand(sock, chatId, question);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.lyrics'):
                {
                    const songTitle = userMessage.split(' ').slice(1).join(' ');
                    await lyricsCommand(sock, chatId, songTitle, message);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.simp'):
                {
                    const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                {
                    const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                    const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    const stupidArgs = userMessage.split(' ').slice(1);
                    await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                }
                commandExecuted = true;
                break;

            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                commandExecuted = true;
                break;

            // ADMIN COMMANDS
            case userMessage.startsWith('.promote'):
                {
                    const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.demote'):
                {
                    const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                    await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                }
                commandExecuted = true;
                break;

            // UTILITY COMMANDS
            case userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.alive':
                await aliveCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                commandExecuted = true;
                break;

            case userMessage === '.setmention':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.blur'):
                {
                    const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                    await blurCommand(sock, chatId, message, quotedMessage);
                }
                commandExecuted = true;
                break;

            // WELCOME/GOODBYE COMMANDS
            case userMessage.startsWith('.welcome'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }
                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.goodbye'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }
                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                }
                commandExecuted = true;
                break;

            // GITHUB COMMAND
            case userMessage === '.git' || userMessage === '.github' || userMessage === '.sc' || userMessage === '.script' || userMessage === '.repo':
                await githubCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // ANTIBADWORD COMMAND
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    const adminStatus = await isAdmin(sock, chatId, senderId);
                    isSenderAdmin = adminStatus.isSenderAdmin;
                    isBotAdmin = adminStatus.isBotAdmin;
                    if (!isBotAdmin) {
                        await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }
                    await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                }
                commandExecuted = true;
                break;

            // CHATBOT COMMAND
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                {
                    const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                    if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                        await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                        commandExecuted = true;
                        break;
                    }
                    const match = userMessage.slice(8).trim();
                    await handleChatbotCommand(sock, chatId, message, match);
                }
                commandExecuted = true;
                break;

            // TAKE/STEAL COMMAND
            case userMessage.startsWith('.take') || userMessage.startsWith('.steal'):
                {
                    const isSteal = userMessage.startsWith('.steal');
                    const sliceLen = isSteal ? 6 : 5;
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                commandExecuted = true;
                break;

            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // GROUP COMMANDS
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                await shipCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                await groupInfoCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                await resetlinkCommand(sock, chatId, senderId);
                commandExecuted = true;
                break;

            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    commandExecuted = true;
                    break;
                }
                await staffCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.jid':
                await groupJidCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // UTILITY COMMANDS CONTINUED
            case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.autostatus'):
                {
                    const autoStatusArgs = userMessage.split(' ').slice(1);
                    await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                }
                commandExecuted = true;
                break;

            // TEXT MAKER COMMANDS
            case userMessage.startsWith('.metallic'):
            case userMessage.startsWith('.ice'):
            case userMessage.startsWith('.snow'):
            case userMessage.startsWith('.impressive'):
            case userMessage.startsWith('.matrix'):
            case userMessage.startsWith('.light'):
            case userMessage.startsWith('.neon'):
            case userMessage.startsWith('.devil'):
            case userMessage.startsWith('.purple'):
            case userMessage.startsWith('.thunder'):
            case userMessage.startsWith('.leaves'):
            case userMessage.startsWith('.1917'):
            case userMessage.startsWith('.arena'):
            case userMessage.startsWith('.hacker'):
            case userMessage.startsWith('.sand'):
            case userMessage.startsWith('.blackpink'):
            case userMessage.startsWith('.glitch'):
            case userMessage.startsWith('.fire'):
                {
                    const style = userMessage.split(' ')[0].slice(1);
                    await textmakerCommand(sock, chatId, message, userMessage, style);
                }
                commandExecuted = true;
                break;

            // ANTIDELETE COMMAND
            case userMessage.startsWith('.antidelete'):
                {
                    const antideleteMatch = userMessage.slice(11).trim();
                    await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                }
                commandExecuted = true;
                break;

            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // PROFILE COMMANDS
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.setgdesc'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.setgname'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                commandExecuted = true;
                break;

            // MEDIA DOWNLOAD COMMANDS
            case userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.spotify'):
                await spotifyCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.play') || userMessage.startsWith('.mp3') || userMessage.startsWith('.ytmp3') || userMessage.startsWith('.song'):
                await songCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.video') || userMessage.startsWith('.ytmp4'):
                await videoCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // AI COMMANDS
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                {
                    const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                    await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                {
                    const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                    await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                }
                commandExecuted = true;
                break;

            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                await handleAreactCommand(sock, chatId, message, senderIsOwnerOrSudo);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // GREETING COMMANDS
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // IMAGE GENERATION
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'):
                await imagineCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            // AUTO COMMANDS
            case userMessage.startsWith('.autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.autoread'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;

            case userMessage.startsWith('.heart'):
                await handleHeart(sock, chatId, message);
                commandExecuted = true;
                break;

            // MEME/IMAGE EFFECTS - Group 1
            case userMessage.startsWith('.horny'):
            case userMessage.startsWith('.circle'):
            case userMessage.startsWith('.lgbt'):
            case userMessage.startsWith('.lolice'):
            case userMessage.startsWith('.simpcard'):
            case userMessage.startsWith('.tonikawa'):
            case userMessage.startsWith('.its-so-stupid'):
            case userMessage.startsWith('.namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = parts[0].slice(1);
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;

            // OOGWAY COMMANDS
            case userMessage.startsWith('.oogway2'):
            case userMessage.startsWith('.oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.tweet'):
            case userMessage.startsWith('.ytcomment'):
            case userMessage.startsWith('.comrade'):
            case userMessage.startsWith('.gay'):
            case userMessage.startsWith('.glass'):
            case userMessage.startsWith('.jail'):
            case userMessage.startsWith('.passed'):
            case userMessage.startsWith('.triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.ytcomment') ? 'youtube-comment' : parts[0].slice(1);
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.nom'):
            case userMessage.startsWith('.poke'):
            case userMessage.startsWith('.cry'):
            case userMessage.startsWith('.kiss'):
            case userMessage.startsWith('.pat'):
            case userMessage.startsWith('.hug'):
            case userMessage.startsWith('.wink'):
            case userMessage.startsWith('.facepalm'):
            case userMessage.startsWith('.face-palm'):
            case userMessage.startsWith('.animuquote'):
            case userMessage.startsWith('.loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(1);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                commandExecuted = true;
                break;
            case userMessage === '.crop':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === '.china':
            case userMessage === '.indonesia':
            case userMessage === '.japan':
            case userMessage === '.korea':
            case userMessage === '.hijab':
                {
                    const country = userMessage.slice(1);
                    await piesAlias(sock, chatId, message, country);
                    commandExecuted = true;
                }
                break;
            case userMessage.startsWith('.update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                commandExecuted = true;
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                commandExecuted = true;
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                commandExecuted = true;
                break;
              
            default:
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status
        if (commandExecuted) {
            await showTypingAfterCommand(sock, chatId);
        }

        // Add reaction to command messages
        if (userMessage.startsWith('.')) {
            await addCommandReaction(sock, message);
        }

    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        console.error('Stack trace:', error.stack);
        try {
            if (chatId) {
                await sock.sendMessage(chatId, {
                    text: '❌ Failed to process command!',
                    ...channelInfo
                });
            }
        } catch (sendError) {
            console.error('Failed to send error message:', sendError.message);
        }
    }
}

// Function to handle .groupjid command
async function groupJidCommand(sock, chatId, message) {
    const groupJid = message.key.remoteJid;
    if (!groupJid.endsWith('@g.us')) {
        return await sock.sendMessage(chatId, {
            text: "❌ This command can only be used in a group."
        });
    }
    await sock.sendMessage(chatId, {
        text: `✅ Group JID: ${groupJid}`
    }, {
        quoted: message
    });
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        if (!id.endsWith('@g.us')) return;

        let isPublic = true;
        try {
            const messageCountPath = path.join(__dirname, 'data', 'messageCount.json');
            if (fs.existsSync(messageCountPath)) {
                const modeData = JSON.parse(fs.readFileSync(messageCountPath, 'utf8'));
                if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
            }
        } catch (e) {
            console.error('Error reading mode in participant update:', e.message);
        }

        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
    }
};