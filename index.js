/**
 * Knight Bot - A WhatsApp Bot
 * Copyright (c) 2024 Professor
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 * - Pair Code implementation inspired by TechGod143 & DGXEON
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
    delay
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
}, 60_000) // every 1 minute

// Memory monitoring - Restart if RAM gets too high
setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 400) {
        logger.warn('RAM too high, restarting bot', { memory: `${used.toFixed(2)}MB` });
        process.exit(1) // Panel will auto-restart
    }
}, 30_000) // check every 30 seconds

let phoneNumber = "94765749332"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "Shanu md"
global.themeemoji = "•"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

// Session generation mode flag
let sessionGenerationMode = false

// Only create readline interface if we're in an interactive environment
const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null
const question = (text) => {
    if (rl) {
        return new Promise((resolve) => rl.question(text, resolve))
    } else {
        // In non-interactive environment, use ownerNumber from settings
        return Promise.resolve(settings.ownerNumber || phoneNumber)
    }
}

// Initialize message retry cache
const msgRetryCounterCache = new NodeCache()

// Function to generate and display SESSION_ID
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
        // Ensure session directory exists
        if (!fs.existsSync('./session')) {
            fs.mkdirSync('./session', { recursive: true })
            logger.info('Session directory created');
        }

        // Check if session exists
        const sessionExists = fs.existsSync('./session/creds.json')
        
        // If no session exists, enable pairing mode
        if (!sessionExists) {
            console.log(chalk.yellow('No session found. Starting pairing code generation mode...'))
            logger.info('No session found, enabling pairing mode');
            sessionGenerationMode = true
        }

        // Initialize auth state
        const { state, saveCreds } = await useMultiFileAuthState('./session')
        
        // Fetch latest Baileys version
        const { version, isLatest } = await fetchLatestBaileysVersion()
        
        console.log(chalk.green(`Using Baileys v${version.join('.')}`))
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

        // Clear old sessions periodically to prevent memory issues
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
        }, 300000); // Every 5 minutes

        // Initialize logger with socket
        logger.setSock(XeonBotInc);
        
        // Initialize console commander
        commander.initialize(XeonBotInc);
        
        // Log bot initialized
        logger.success('Bot initialized successfully');

        // Save credentials when they update
        XeonBotInc.ev.on('creds.update', saveCreds)

        store.bind(XeonBotInc.ev)

        // Message handling
        XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
            try {
                const mek = chatUpdate.messages[0]
                if (!mek.message) return
                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
                if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                    await handleStatus(XeonBotInc, chatUpdate);
                    return;
                }
                
                // Check if message is from owner - ALWAYS allow owner messages
                const isOwnerMessage = mek.key.fromMe || mek.key.remoteJid === owner[0] + '@s.whatsapp.net';
                
                // In private mode, only block non-owner non-group messages
                if (!XeonBotInc.public && !isOwnerMessage && chatUpdate.type === 'notify') {
                    const isGroup = mek.key?.remoteJid?.endsWith('@g.us')
                    if (!isGroup) {
                        logger.debug('Message blocked - Private mode, not owner, not group');
                        return; // Block DMs in private mode, but allow group messages
                    }
                }
                
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return

                // Clear message retry cache to prevent memory bloat
                if (XeonBotInc?.msgRetryCounterCache) {
                    XeonBotInc.msgRetryCounterCache.clear()
                }

                try {
                    await handleMessages(XeonBotInc, chatUpdate, true)
                } catch (err) {
                    logger.error("Error in handleMessages", { error: err.message });
                    // Only try to send error message if we have a valid chatId
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

        // Add these event handlers for better functionality
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

        XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

        // Handle pairing code - ENHANCED FOR SESSION GENERATION
        if (pairingCode && !XeonBotInc.authState.creds.registered) {
            if (useMobile) throw new Error('Cannot use pairing code with mobile api')

            // Use preset phone number
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
                    console.log(chalk.red('Failed to get pairing code. Retrying...'))
                    
                    // Retry after 5 seconds
                    setTimeout(async () => {
                        try {
                            let code = await XeonBotInc.requestPairingCode(phoneNumber)
                            code = code?.match(/.{1,4}/g)?.join("-") || code
                            
                            console.log('\n' + chalk.cyan('╭━━━━━━━━━━━━━━━━━━━━━━━━━━━╮'))
                            console.log(chalk.cyan('│') + chalk.bold.green('   YOUR PAIRING CODE:     ') + chalk.cyan('│'))
                            console.log(chalk.cyan('│') + chalk.bold.white(`        ${code}         `) + chalk.cyan('│'))
                            console.log(chalk.cyan('╰━━━━━━━━━━━━━━━━━━━━━━━━━━━╯\n'))
                            
                            logger.info('Pairing code generated (retry)', { code });
                        } catch (retryError) {
                            logger.error('Retry failed', { error: retryError.message });
                            console.error(chalk.red('Retry failed. Please restart the bot.'))
                        }
                    }, 5000)
                }
            }, 3000)
        }

        // Connection handling - ENHANCED FOR SESSION ID GENERATION
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

                // Generate SESSION_ID if this was a new session
                if (sessionGenerationMode) {
                    await delay(2000) // Wait for creds to be fully saved
                    generateSessionId()
                    sessionGenerationMode = false // Reset flag
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
                console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'KNIGHT BOT'} ]`)}\n\n`))
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

        // Track recently-notified callers to avoid spamming messages
        const antiCallNotified = new Set();

        // Anticall handler: block callers when enabled
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
                        // First: attempt to reject the call if supported
                        try {
                            if (typeof XeonBotInc.rejectCall === 'function' && call.id) {
                                await XeonBotInc.rejectCall(call.id, callerJid);
                            } else if (typeof XeonBotInc.sendCallOfferAck === 'function' && call.id) {
                                await XeonBotInc.sendCallOfferAck(call.id, callerJid, 'reject');
                            }
                        } catch {}

                        // Notify the caller only once within a short window
                        if (!antiCallNotified.has(callerJid)) {
                            antiCallNotified.add(callerJid);
                            setTimeout(() => antiCallNotified.delete(callerJid), 60000);
                            await XeonBotInc.sendMessage(callerJid, { text: '📵 Anticall is enabled. Your call was rejected and you will be blocked.' });
                        }
                    } catch {}
                    // Then: block after a short delay to ensure rejection and message are processed
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

// Session cleanup on exit
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

// Start the bot with error handling
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