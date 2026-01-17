const fs = require('fs');
const path = require('path');

console.log('🔄 Resetting session...');

const sessionDir = path.join(__dirname, 'session');
if (fs.existsSync(sessionDir)) {
    fs.rmSync(sessionDir, { recursive: true, force: true });
    console.log('✅ Session deleted');
}

const storeFile = path.join(__dirname, 'data', 'store.json');
if (fs.existsSync(storeFile)) {
    fs.unlinkSync(storeFile);
    console.log('✅ Store cleared');
}

console.log('✅ Reset complete! Run npm start to re-pair');