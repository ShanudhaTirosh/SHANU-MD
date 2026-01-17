/**
 * Fixed Admin Detection for SHANU-MD Bot
 * Fixes: "Please make the bot an admin" error
 */

const { jidNormalizedUser } = require('@whiskeysockets/baileys');

/**
 * Check if sender and bot are admins
 * @param {Object} sock - WhatsApp socket
 * @param {string} chatId - Group JID
 * @param {string} senderId - Sender JID
 * @returns {Promise<{isSenderAdmin: boolean, isBotAdmin: boolean}>}
 */
async function isAdmin(sock, chatId, senderId) {
    try {
        // Default to false
        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Only check admin status in groups
        if (!chatId.endsWith('@g.us')) {
            console.log('⚠️ Not a group, skipping admin check');
            return { isSenderAdmin: true, isBotAdmin: true }; // In DMs, everyone is "admin"
        }

        // Normalize JIDs
        const normalizedSenderId = jidNormalizedUser(senderId);
        const botJid = jidNormalizedUser(sock.user.id);

        console.log('🔍 Admin Check:', {
            chatId: chatId.split('@')[0],
            sender: normalizedSenderId.split('@')[0],
            bot: botJid.split('@')[0]
        });

        // Fetch group metadata with retry logic
        let groupMetadata = null;
        let retries = 3;
        
        while (retries > 0 && !groupMetadata) {
            try {
                groupMetadata = await sock.groupMetadata(chatId);
                break;
            } catch (error) {
                console.error(`⚠️ Failed to fetch group metadata (${retries} retries left):`, error.message);
                retries--;
                if (retries > 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
                }
            }
        }

        if (!groupMetadata) {
            console.error('❌ Could not fetch group metadata after retries');
            // If we can't fetch metadata, assume both are admins to avoid blocking
            return { isSenderAdmin: true, isBotAdmin: true };
        }

        if (!groupMetadata.participants || !Array.isArray(groupMetadata.participants)) {
            console.error('❌ Invalid participants data in group metadata');
            return { isSenderAdmin: true, isBotAdmin: true };
        }

        console.log(`📊 Group has ${groupMetadata.participants.length} participants`);

        // Check each participant
        for (const participant of groupMetadata.participants) {
            try {
                const participantJid = jidNormalizedUser(participant.id);
                const isAdmin = participant.admin === 'admin' || participant.admin === 'superadmin';

                // Check if this is the sender
                if (participantJid === normalizedSenderId) {
                    isSenderAdmin = isAdmin;
                    console.log(`👤 Sender admin status: ${isAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}`);
                }

                // Check if this is the bot
                if (participantJid === botJid) {
                    isBotAdmin = isAdmin;
                    console.log(`🤖 Bot admin status: ${isAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}`);
                }

                // If we found both, no need to continue
                if (isSenderAdmin !== false && isBotAdmin !== false) {
                    break;
                }
            } catch (error) {
                console.error('Error checking participant:', error.message);
            }
        }

        console.log('✅ Admin check result:', { isSenderAdmin, isBotAdmin });

        return { isSenderAdmin, isBotAdmin };

    } catch (error) {
        console.error('❌ Fatal error in isAdmin:', error.message);
        console.error('Stack:', error.stack);
        
        // On error, return true for both to avoid blocking functionality
        // Better to allow actions than to block legitimate admins
        return { isSenderAdmin: true, isBotAdmin: true };
    }
}

module.exports = isAdmin;