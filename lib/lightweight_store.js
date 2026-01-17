const fs = require('fs');
const path = require('path');
const { jidNormalizedUser } = require('@whiskeysockets/baileys');

class LightweightStore {
    constructor() {
        this.contacts = {};
        this.messages = {};
        this.groupMetadata = {};
        this.storePath = path.join(__dirname, '../data/store.json');
        this.chats = {};
    }

    bind(ev) {
        ev.on('contacts.update', (updates) => {
            for (const update of updates) {
                const id = jidNormalizedUser(update.id);
                this.contacts[id] = { ...(this.contacts[id] || {}), ...update };
            }
        });

        ev.on('groups.update', (updates) => {
            for (const update of updates) {
                const id = update.id;
                if (this.groupMetadata[id]) {
                    this.groupMetadata[id] = { 
                        ...this.groupMetadata[id], 
                        ...update 
                    };
                }
            }
        });

        ev.on('group-participants.update', (update) => {
            const id = update.id;
            if (this.groupMetadata[id]) {
                const metadata = this.groupMetadata[id];
                switch (update.action) {
                    case 'add':
                        metadata.participants.push(...update.participants.map(id => ({
                            id: jidNormalizedUser(id),
                            admin: null
                        })));
                        break;
                    case 'remove':
                        metadata.participants = metadata.participants.filter(
                            p => !update.participants.includes(p.id)
                        );
                        break;
                    case 'promote':
                    case 'demote':
                        for (const participant of metadata.participants) {
                            if (update.participants.includes(participant.id)) {
                                participant.admin = update.action === 'promote' ? 'admin' : null;
                            }
                        }
                        break;
                }
            }
        });

        ev.on('messages.upsert', ({ messages }) => {
            for (const msg of messages) {
                if (!msg.key) continue;
                const jid = jidNormalizedUser(msg.key.remoteJid);
                if (!this.messages[jid]) this.messages[jid] = {};
                this.messages[jid][msg.key.id] = msg;
            }
        });

        ev.on('chats.set', ({ chats }) => {
            for (const chat of chats) {
                this.chats[chat.id] = chat;
            }
        });

        ev.on('chats.update', (updates) => {
            for (const update of updates) {
                if (this.chats[update.id]) {
                    this.chats[update.id] = { ...this.chats[update.id], ...update };
                }
            }
        });
    }

    async loadMessage(jid, id) {
        const messages = this.messages[jidNormalizedUser(jid)];
        if (!messages) return null;
        return messages[id] || null;
    }

    async fetchGroupMetadata(jid) {
        const metadata = this.groupMetadata[jid];
        if (metadata) return metadata;
        return null;
    }

    async updateGroupMetadata(jid, metadata) {
        this.groupMetadata[jid] = metadata;
    }

    readFromFile() {
        try {
            if (fs.existsSync(this.storePath)) {
                const data = JSON.parse(fs.readFileSync(this.storePath, 'utf-8'));
                this.contacts = data.contacts || {};
                this.groupMetadata = data.groupMetadata || {};
                this.chats = data.chats || {};
                console.log('📦 Store loaded from file');
            }
        } catch (error) {
            console.error('Error reading store:', error.message);
        }
    }

    writeToFile() {
        try {
            const dir = path.dirname(this.storePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(this.storePath, JSON.stringify({
                contacts: this.contacts,
                groupMetadata: this.groupMetadata,
                chats: this.chats
            }, null, 2));
        } catch (error) {
            console.error('Error writing store:', error.message);
        }
    }
}

module.exports = new LightweightStore();