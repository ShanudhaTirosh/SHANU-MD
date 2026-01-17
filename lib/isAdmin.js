/**
 * FIXED Admin Detection - Works with Baileys 6.7.5
 * Fixes: "Not Admin" error even when admin
 */

const { jidNormalizedUser } = require('@whiskeysockets/baileys');

async function isAdmin(sock, chatId, senderId) {
    try {
        // Not a group? Everyone is "admin"
        if (!chatId.endsWith('@g.us')) {
            return { isSenderAdmin: true, isBotAdmin: true };
        }

        // Normalize JIDs
        const normalizedSender = jidNormalizedUser(senderId);
        const normalizedBot = jidNormalizedUser(sock.user.id);

        console.log('🔍 Admin Check Started');
        console.log('   📍 Group:', chatId.split('@')[0]);
        console.log('   👤 Sender:', normalizedSender.split('@')[0]);
        console.log('   🤖 Bot:', normalizedBot.split('@')[0]);

        // Fetch group metadata with retries
        let metadata = null;
        for (let i = 0; i < 3; i++) {
            try {
                metadata = await sock.groupMetadata(chatId);
                if (metadata && metadata.participants) break;
                await new Promise(r => setTimeout(r, 1000));
            } catch (e) {
                console.log(`   ⚠️ Retry ${i + 1}/3: ${e.message}`);
                if (i === 2) throw e;
            }
        }

        if (!metadata || !metadata.participants) {
            console.log('   ❌ No metadata, allowing by default');
            return { isSenderAdmin: true, isBotAdmin: true };
        }

        console.log(`   📊 Participants: ${metadata.participants.length}`);

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check each participant
        for (const p of metadata.participants) {
            const pid = jidNormalizedUser(p.id);
            const isAdmin = p.admin === 'admin' || p.admin === 'superadmin';

            if (pid === normalizedSender) {
                isSenderAdmin = isAdmin;
                console.log(`   👤 Sender: ${isAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}`);
            }

            if (pid === normalizedBot) {
                isBotAdmin = isAdmin;
                console.log(`   🤖 Bot: ${isAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}`);
            }
        }

        console.log('   ✅ Check complete');
        return { isSenderAdmin, isBotAdmin };

    } catch (error) {
        console.error('❌ Admin check failed:', error.message);
        // On error, allow everything to avoid blocking
        return { isSenderAdmin: true, isBotAdmin: true };
    }
}

module.exports = isAdmin;