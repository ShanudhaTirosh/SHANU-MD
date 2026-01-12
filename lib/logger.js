const fs = require('fs');
const path = require('path');

class ChannelLogger {
    constructor() {
        this.logQueue = [];
        this.isProcessing = false;
        this.logFile = path.join(__dirname, '../data/bot_logs.json');
        this.channelJid = '120363423620239927@newsletter'; // Your channel JID
        this.sock = null;
        this.logInterval = 5000; // Send logs every 5 seconds
        this.maxQueueSize = 50; // Maximum logs to keep in queue
        
        // Initialize log file
        this.initLogFile();
        
        // Start log processor
        this.startLogProcessor();
    }

    initLogFile() {
        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, JSON.stringify({ logs: [] }, null, 2));
        }
    }

    setSock(sock) {
        this.sock = sock;
    }

    log(level, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            message,
            data,
            pid: process.pid
        };

        // Add to queue
        this.logQueue.push(logEntry);

        // Limit queue size
        if (this.logQueue.length > this.maxQueueSize) {
            this.logQueue = this.logQueue.slice(-this.maxQueueSize);
        }

        // Save to file
        this.saveToFile(logEntry);

        // Console output with colors
        this.consoleLog(logEntry);
    }

    consoleLog(entry) {
        const colors = {
            INFO: '\x1b[36m',    // Cyan
            WARN: '\x1b[33m',    // Yellow
            ERROR: '\x1b[31m',   // Red
            SUCCESS: '\x1b[32m', // Green
            DEBUG: '\x1b[35m'    // Magenta
        };
        const reset = '\x1b[0m';
        const color = colors[entry.level] || reset;
        
        console.log(`${color}[${entry.timestamp}] [${entry.level}]${reset} ${entry.message}`);
        if (Object.keys(entry.data).length > 0) {
            console.log(`${color}Data:${reset}`, entry.data);
        }
    }

    saveToFile(logEntry) {
        try {
            let logs = { logs: [] };
            if (fs.existsSync(this.logFile)) {
                logs = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
            }
            
            logs.logs.push(logEntry);
            
            // Keep only last 1000 logs in file
            if (logs.logs.length > 1000) {
                logs.logs = logs.logs.slice(-1000);
            }
            
            fs.writeFileSync(this.logFile, JSON.stringify(logs, null, 2));
        } catch (error) {
            console.error('Failed to save log to file:', error);
        }
    }

    async startLogProcessor() {
        setInterval(async () => {
            if (this.logQueue.length === 0 || !this.sock || this.isProcessing) {
                return;
            }

            this.isProcessing = true;

            try {
                // Get logs from queue
                const logsToSend = [...this.logQueue];
                this.logQueue = []; // Clear queue

                // Format logs for channel
                const logText = this.formatLogsForChannel(logsToSend);

                // Send to channel
                await this.sendToChannel(logText);
            } catch (error) {
                console.error('Error processing logs:', error);
            } finally {
                this.isProcessing = false;
            }
        }, this.logInterval);
    }

    formatLogsForChannel(logs) {
        const header = `🤖 *SHANU BOT LOGS*\n`;
        const timestamp = `⏰ ${new Date().toLocaleString()}\n`;
        const separator = `${'─'.repeat(30)}\n`;
        
        let logText = header + timestamp + separator + '\n';

        logs.forEach((log, index) => {
            const emoji = this.getLogEmoji(log.level);
            const time = new Date(log.timestamp).toLocaleTimeString();
            
            logText += `${emoji} *${log.level}* [${time}]\n`;
            logText += `📝 ${log.message}\n`;
            
            if (Object.keys(log.data).length > 0) {
                logText += `📊 Data: ${JSON.stringify(log.data, null, 2)}\n`;
            }
            
            if (index < logs.length - 1) {
                logText += '\n';
            }
        });

        // Memory usage
        const memUsage = process.memoryUsage();
        logText += `\n${separator}`;
        logText += `💾 Memory: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB\n`;
        logText += `🔄 Uptime: ${this.formatUptime(process.uptime())}\n`;

        return logText;
    }

    getLogEmoji(level) {
        const emojis = {
            INFO: 'ℹ️',
            WARN: '⚠️',
            ERROR: '❌',
            SUCCESS: '✅',
            DEBUG: '🔍'
        };
        return emojis[level] || '📌';
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    }

    async sendToChannel(text) {
        if (!this.sock) {
            console.log('Socket not initialized, skipping channel log');
            return;
        }

        try {
            await this.sock.sendMessage(this.channelJid, {
                text: text,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: this.channelJid,
                    newsletterName: 'Shanu-MD Bot',
                    serverMessageId: -1
                    }
                }
            });
        } catch (error) {
            console.error('Failed to send log to channel:', error.message);
        }
    }

    // Convenience methods
    info(message, data) {
        this.log('INFO', message, data);
    }

    warn(message, data) {
        this.log('WARN', message, data);
    }

    error(message, data) {
        this.log('ERROR', message, data);
    }

    success(message, data) {
        this.log('SUCCESS', message, data);
    }

    debug(message, data) {
        this.log('DEBUG', message, data);
    }
}

// Create singleton instance
const logger = new ChannelLogger();

module.exports = logger;