const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup...');

// Clean temp folder
const tempDir = path.join(__dirname, 'temp');
if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('✅ Temp folder cleaned');
}

// Clean old messages from store
const storePath = path.join(__dirname, 'data', 'store.json');
if (fs.existsSync(storePath)) {
    try {
        const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
        // Keep only recent messages (last 100 per chat)
        if (store.messages) {
            for (const jid in store.messages) {
                const messages = Object.values(store.messages[jid]);
                if (messages.length > 100) {
                    const recent = messages.slice(-100);
                    store.messages[jid] = {};
                    recent.forEach(msg => {
                        if (msg.key && msg.key.id) {
                            store.messages[jid][msg.key.id] = msg;
                        }
                    });
                }
            }
        }
        fs.writeFileSync(storePath, JSON.stringify(store, null, 2));
        console.log('✅ Store optimized');
    } catch (error) {
        console.error('Error cleaning store:', error.message);
    }
}

console.log('✅ Cleanup complete!');