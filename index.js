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
/**
 * SHANU - MD WhatsApp Bot - FIXED VERSION
 * Updated Baileys to latest version with group chat fixes
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, sleep, reSize } = require('./lib/myfunc')
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay,
    getAggregateVotesInPollMessage
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

// Logger and commander
const logger = require('./lib/logger');
const commander = require('./lib/console-commander');

// Import lightweight store
const store = require('./lib/lightweight_store')

// Initialize store
store.readFromFile()
const settings = require('./settings')
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000)

// Memory optimization - Force garbage collection if available
setInterval(() => {
    if (global.gc) {
        global.gc()
        logger.debug('Garbage collection completed');
    }
}, 60_000)

// Memory monitoring
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        logger.warn('RAM too high, restarting bot', { memory: `${used.toFixed(2)}MB` });
        process.exit(1)
    }
}, 30_000)

let phoneNumber = "94765749332"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "Shanu md"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

let sessionGenerationMode = false

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

const msgRetryCounterCache = new NodeCache()

const generateSessionId = () => {
    try {
        const sessionPath = './session/creds.json'
        if (fs.existsSync(sessionPath)) {
            const sessionData = fs.readFileSync(sessionPath)
            const sessionBase64 = sessionData.toString('base64')
            const sessionId = 'SHANU-MD~' + sessionBase64
            
            console.log('\n' + chalk.cyan('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮'))
            console.log(chalk.cyan('│') + chalk.bold.green('          SESSION ID GENERATED!              ') + chalk.cyan('│'))
            console.log(chalk.cyan('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯'))
            console.log('\n' + chalk.yellow('📝 Your SESSION_ID:\n'))
            console.log(chalk.green(sessionId))
            console.log('\n' + chalk.yellow('💾 Save this SESSION_ID in your config/environment variables'))
            console.log(chalk.red('⚠️  Keep it secure and do not share it!\n'))
            
            logger.success('SESSION_ID generated successfully');
            return sessionId
        }
    } catch (error) {
        logger.error('Error generating SESSION_ID', { error: error.message });
        console.error(chalk.red('Error generating SESSION_ID:'), error)
    }
    return null
}

const startXeonBotInc = async () => {
    try {
        if (!fs.existsSync('./session')) {
            fs.mkdirSync('./session', { recursive: true })
            logger.info('Session directory created');
        }

        const sessionExists = fs.existsSync('./session/creds.json')
        
        if (!sessionExists) {
            console.log(chalk.yellow('No session found. Starting pairing code generation mode...'))
            logger.info('No session found, enabling pairing mode');
            sessionGenerationMode = true
        }

        const { state, saveCreds } = await useMultiFileAuthState('./session')
        
        // ✅ UPDATED: Fetch latest Baileys version
        const { version, isLatest } = await fetchLatestBaileysVersion()
        
        console.log(chalk.green(`Using Baileys v${version.join('.')} ${isLatest ? '(Latest)' : '(Outdated)'}`))
        logger.info('Baileys version loaded', { version: version.join('.'), isLatest });

        const XeonBotInc = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: true,
            syncFullHistory: false,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid)
                let msg = await store.loadMessage(jid, key.id)
                return msg?.message || ""
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
            retryRequestDelayMs: 250,
            maxMsgRetryCount: 5,
            fireInitQueries: true,
            emitOwnEvents: false,
            shouldIgnoreJid: jid => false,
            cachedGroupMetadata: async (jid) => {
                const data = await store.fetchGroupMetadata(jid);
                return data || null;
            }
        })

        setInterval(() => {
            if (XeonBotInc?.msgRetryCounterCache) {
                const cache = XeonBotInc.msgRetryCounterCache;
                const keys = cache.keys();
                let cleared = 0;
                for (const key of keys) {
                    cache.del(key);
                    cleared++;
                }
                if (cleared > 0) {
                    logger.debug(`Cleared ${cleared} message retry cache entries`);
                }
            }
        }, 300000);

        logger.setSock(XeonBotInc);
        commander.initialize(XeonBotInc);
        logger.success('Bot initialized successfully');

        XeonBotInc.ev.on('creds.update', saveCreds)
        store.bind(XeonBotInc.ev)

        // ✅ FIXED: Message handling with proper group chat support
        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                
                // Handle status updates
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(XeonBotInc, chatUpdate);
                    return;
                }
                
                // ✅ CRITICAL FIX: Determine if this is a group
                const chatId = mek.key.remoteJid;
                const isGroup = chatId?.endsWith('@g.us');
                
                // ✅ UNIFIED OWNER DETECTION
                const senderId = mek.key.participant || mek.key.remoteJid;
                const senderIsSudo = await isSudo(senderId);
                const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, XeonBotInc, chatId);
                const isOwnerMessage = mek.key.fromMe || senderIsOwnerOrSudo || senderIsSudo;
                
                // ✅ FIXED: Read bot mode
                let isPublic = true;
                try {
                    const messageCountPath = './data/messageCount.json';
                    if (fs.existsSync(messageCountPath)) {
                        const data = JSON.parse(fs.readFileSync(messageCountPath, 'utf8'));
                        if (typeof data.isPublic === 'boolean') {
                            isPublic = data.isPublic;
                        }
                    }
                } catch (error) {
                    console.error('Error reading bot mode:', error.message);
                }
                
                // ✅ CRITICAL FIX: Private mode logic
                // In PRIVATE mode:
                // - Groups: Messages work for everyone, but COMMANDS only work for owner
                // - DMs: Only owner can interact
                if (!isPublic && !isOwnerMessage && chatUpdate.type === 'notify') {
                    // ✅ If it's a DM (not a group), block completely
                    if (!isGroup) {
                        logger.debug('Message blocked - Private mode DM, not owner', {
                            senderId: senderId.split('@')[0],
                            fromMe: mek.key.fromMe,
                            isGroup: false
                        });
                        return;
                    }
                    // ✅ If it's a group, DON'T block here - let main.js handle command restrictions
                    // This allows group messages to be seen but commands to be restricted
                }
                
                // Skip Baileys system messages
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

                // Clear message retry cache
                if (XeonBotInc?.msgRetryCounterCache) {
                    XeonBotInc.msgRetryCounterCache.clear()
                }

                // ✅ Pass to main handler
                try {
                    await handleMessages(XeonBotInc, chatUpdate, true)
                } catch (err) {
                    logger.error("Error in handleMessages", { error: err.message });
                    if (mek.key && mek.key.remoteJid) {
                        await XeonBotInc.sendMessage(mek.key.remoteJid, {
                            text: '❌ An error occurred while processing your message.',
                            contextInfo: {
                                forwardingScore: 1,
                                isForwarded: true,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: '120363423620239927@newsletter',
                                    newsletterName: 'Shanu-MD Bot',
                                    serverMessageId: -1
                                }
                            }
                        }).catch(console.error);
                    }
                }
            } catch (err) {
                logger.error("Error in messages.upsert", { error: err.message });
            }
        })

        XeonBotInc.decodeJid = (jid) => {
            if (!jid) return jid
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {}
                return decode.user && decode.server && decode.user + '@' + decode.server || jid
            } else return jid
        }

        XeonBotInc.ev.on('contacts.update', update => {
            for (let contact of update) {
                let id = XeonBotInc.decodeJid(contact.id)
                if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
            }
        })

        XeonBotInc.getName = (jid, withoutContact = false) => {
            id = XeonBotInc.decodeJid(jid)
            withoutContact = XeonBotInc.withoutContact || withoutContact
            let v
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {}
                if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
            })
            else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
                XeonBotInc.user :
                (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
        }

        XeonBotInc.public = true
        try {
            const messageCountPath = './data/messageCount.json';
            if (fs.existsSync(messageCountPath)) {
                const data = JSON.parse(fs.readFileSync(messageCountPath, 'utf8'));
                if (typeof data.isPublic === 'boolean') {
                    XeonBotInc.public = data.isPublic;
                    console.log(chalk.cyan(`Bot mode loaded: ${XeonBotInc.public ? 'PUBLIC ✅' : 'PRIVATE 🔒'}`));
                }
            }
        } catch (error) {
            console.error('Error reading bot mode:', error);
        }

        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

        // Pairing code handling
        if (pairingCode && !XeonBotInc.authState.creds.registered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api')

            let phoneNumber = "94765749332"
            
            console.log(chalk.yellow(`\n📱 Using phone number: ${phoneNumber}`))
            logger.info('Using preset phone number for pairing', { number: phoneNumber });

            setTimeout(async () => {
                try {
                    let code = await XeonBotInc.requestPairingCode(phoneNumber)
                    code = code?.match(/.{1,4}/g)?.join("-") || code
                    
                    console.log('\n' + chalk.cyan('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮'))
                    console.log(chalk.cyan('│') + chalk.bold.green('   YOUR PAIRING CODE:     ') + chalk.cyan('│'))
                    console.log(chalk.cyan('│') + chalk.bold.white(`        ${code}         `) + chalk.cyan('│'))
                    console.log(chalk.cyan('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n'))
                    
                    console.log(chalk.yellow('📱 Enter this code in WhatsApp:'))
                    console.log(chalk.white('   1. Open WhatsApp on your phone'))
                    console.log(chalk.white('   2. Go to Settings > Linked Devices'))
                    console.log(chalk.white('   3. Tap "Link a Device"'))
                    console.log(chalk.white('   4. Tap "Link with phone number"'))
                    console.log(chalk.white(`   5. Enter the code: ${chalk.bold.green(code)}\n`))
                    
                    logger.info('Pairing code generated', { code });
                } catch (error) {
                    logger.error('Failed to get pairing code', { error: error.message });
                    console.error('Error requesting pairing code:', error)
                }
            }, 3000)
        }

        // Connection handling
        XeonBotInc.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s
            
            if (qr) {
                console.log(chalk.yellow('📱 QR Code generated. Please scan with WhatsApp.'))
                logger.info('QR Code generated');
            }
            
            if (connection === 'connecting') {
                console.log(chalk.yellow('🔄 Connecting to WhatsApp...'))
                logger.info('Connecting to WhatsApp...');
            }
            
            if (connection == "open") {
                console.log(chalk.magenta(` `))
                console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))
                
                logger.success('Bot connected successfully', { 
                    user: XeonBotInc.user.id,
                    name: XeonBotInc.user.name 
                });

                if (sessionGenerationMode) {
                    await delay(2000)
                    generateSessionId()
                    sessionGenerationMode = false
                }

                try {
                    const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
                    await XeonBotInc.sendMessage(botNumber, {
                        text: `🤖 Bot Connected Successfully!\n\n⏰ Time: ${new Date().toLocaleString()}\n✅ Status: Online and Ready!\n\n✅Make sure to join below channel`,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363423620239927@newsletter',
                                newsletterName: 'Shanu-MD Bot',
                                serverMessageId: -1
                            }
                        }
                    });
                    logger.info('Connection message sent to bot owner');
                } catch (error) {
                    logger.error('Failed to send connection message', { error: error.message });
                }

                await delay(1999)
                console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'SHANU BOT'} ]`)}\n\n`))
                console.log(chalk.cyan(`< ================================================== >`))
                console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT CHANNEL: MR UNIQUE HACKER`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: mrunqiuehacker`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} WA NUMBER: ${owner}`))
                console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: MR UNIQUE HACKER`))
                console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected Successfully! ✅`))
                console.log(chalk.blue(`Bot Version: ${settings.version}`))
            }
            
            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
                const statusCode = lastDisconnect?.error?.output?.statusCode
                
                logger.warn('Connection closed, attempting reconnect', { 
                    statusCode,
                    shouldReconnect 
                });
                
                if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
                    try {
                        rmSync('./session', { recursive: true, force: true })
                        logger.warn('Session folder deleted, re-authentication required');
                    } catch (error) {
                        logger.error('Failed to delete session', { error: error.message });
                    }
                    console.log(chalk.red('Session logged out. Please re-authenticate.'))
                }
                
                if (shouldReconnect) {
                    logger.info('Reconnecting in 5 seconds...');
                    await delay(5000)
                    startXeonBotInc()
                }
            }
        })

        // Anticall handler
        const antiCallNotified = new Set();
        XeonBotInc.ev.on('call', async (calls) => {
            try {
                const { readState: readAnticallState } = require('./commands/anticall');
                const state = readAnticallState();
                if (!state.enabled) return;
                for (const call of calls) {
                    const callerJid = call.from || call.peerJid || call.chatId;
                    if (!callerJid) continue;
                    
                    logger.info('Call blocked by anticall', { caller: callerJid });
                    
                    try {
                        try {
                            if (typeof XeonBotInc.rejectCall === 'function' && call.id) {
                                await XeonBotInc.rejectCall(call.id, callerJid);
                            }
                        } catch {}

                        if (!antiCallNotified.has(callerJid)) {
                            antiCallNotified.add(callerJid);
                            setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                            await XeonBotInc.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                        }
                    } catch {}
                    
                    setTimeout(async () => {
                        try { 
                            await XeonBotInc.updateBlockStatus(callerJid, 'block');
                            logger.success('Caller blocked', { caller: callerJid });
                        } catch {}
                    }, 800);
                }
            } catch (e) {
                logger.error('Error in anticall handler', { error: e.message });
            }
        });

        XeonBotInc.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(XeonBotInc, update);
        });

        XeonBotInc.ev.on('messages.upsert', async (m) => {
            if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
                await handleStatus(XeonBotInc, m);
            }
        });

        XeonBotInc.ev.on('status.update', async (status) => {
            await handleStatus(XeonBotInc, status);
        });

        XeonBotInc.ev.on('messages.reaction', async (status) => {
            await handleStatus(XeonBotInc, status);
        });

        return XeonBotInc
    } catch (error) {
        logger.error('Fatal error in startXeonBotInc', { 
            error: error.message,
            stack: error.stack 
        });
        await delay(5000)
        startXeonBotInc()
    }
}

process.on('SIGINT', async () => {
    logger.info('Received SIGINT, closing gracefully...');
    if (global.XeonBotInc?.ws?.socket) {
        await global.XeonBotInc.ws.close();
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, closing gracefully...');
    if (global.XeonBotInc?.ws?.socket) {
        await global.XeonBotInc.ws.close();
    }
    process.exit(0);
});

startXeonBotInc().catch(error => {
    logger.error('Fatal startup error', { error: error.message });
    console.error('Fatal error:', error)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', { error: err.message, stack: err.stack });
    console.error('Uncaught Exception:', err)
})

process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection', { error: err?.message || err });
    console.error('Unhandled Rejection:', err)
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    logger.info('File updated, reloading', { file: __filename });
    delete require.cache[file]
    require(file)
})