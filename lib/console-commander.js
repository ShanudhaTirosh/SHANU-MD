const readline = require('readline');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class ConsoleCommander {
    constructor() {
        this.rl = null;
        this.sock = null;
        this.commands = new Map();
        this.commandHistory = [];
        this.maxHistory = 100;
        
        // Register default commands
        this.registerDefaultCommands();
    }

    initialize(sock) {
        this.sock = sock;
        
        // Only create readline interface in interactive environment
        if (process.stdin.isTTY) {
            this.rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
                prompt: '🤖 Shanu> '
            });

            this.rl.on('line', (line) => this.handleCommand(line.trim()));
            this.rl.on('close', () => {
                logger.info('Console commander closed');
                process.exit(0);
            });

            // Start prompt
            this.showWelcome();
            this.rl.prompt();
        } else {
            logger.info('Non-TTY environment detected, console commands disabled');
        }
    }

    showWelcome() {
        console.log('\n' + '='.repeat(50));
        console.log('🤖 KNIGHT BOT CONSOLE COMMANDER');
        console.log('='.repeat(50));
        console.log('Type "help" to see available commands');
        console.log('Type "exit" to quit\n');
    }

    registerDefaultCommands() {
        // Help command
        this.registerCommand('help', 'Show all available commands', () => {
            console.log('\n📋 Available Commands:\n');
            this.commands.forEach((cmd, name) => {
                console.log(`  ${name.padEnd(20)} - ${cmd.description}`);
            });
            console.log('');
        });

        // Status command
        this.registerCommand('status', 'Show bot status', () => {
            const memUsage = process.memoryUsage();
            console.log('\n📊 Bot Status:');
            console.log(`  Memory: ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`);
            console.log(`  Uptime: ${this.formatUptime(process.uptime())}`);
            console.log(`  PID: ${process.pid}`);
            console.log(`  Connected: ${this.sock ? 'Yes' : 'No'}`);
            console.log('');
        });

        // Restart command
        this.registerCommand('restart', 'Restart the bot', () => {
            console.log('🔄 Restarting bot...');
            logger.warn('Bot restart initiated from console');
            setTimeout(() => process.exit(0), 1000);
        });

        // Clear console
        this.registerCommand('clear', 'Clear console screen', () => {
            console.clear();
            this.showWelcome();
        });

        // Execute shell command
        this.registerCommand('exec', 'Execute shell command (exec <command>)', (args) => {
            const command = args.join(' ');
            if (!command) {
                console.log('❌ Please provide a command to execute');
                return;
            }

            console.log(`⚙️ Executing: ${command}`);
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.log(`❌ Error: ${error.message}`);
                    logger.error('Console exec failed', { command, error: error.message });
                    return;
                }
                if (stderr) {
                    console.log(`⚠️ Stderr: ${stderr}`);
                }
                console.log(`✅ Output:\n${stdout}`);
                logger.info('Console exec success', { command });
            });
        });

        // Send message
        this.registerCommand('send', 'Send message (send <jid> <message>)', async (args) => {
            if (!this.sock) {
                console.log('❌ Bot not connected');
                return;
            }
            if (args.length < 2) {
                console.log('❌ Usage: send <jid> <message>');
                return;
            }

            const jid = args[0];
            const message = args.slice(1).join(' ');

            try {
                await this.sock.sendMessage(jid, { text: message });
                console.log(`✅ Message sent to ${jid}`);
                logger.info('Message sent from console', { jid, message });
            } catch (error) {
                console.log(`❌ Failed to send message: ${error.message}`);
                logger.error('Console send failed', { jid, error: error.message });
            }
        });

        // Broadcast message
        this.registerCommand('broadcast', 'Broadcast message to all groups', async (args) => {
            if (!this.sock) {
                console.log('❌ Bot not connected');
                return;
            }
            if (args.length === 0) {
                console.log('❌ Usage: broadcast <message>');
                return;
            }

            const message = args.join(' ');
            console.log('📢 Broadcasting message...');

            try {
                const groups = await this.sock.groupFetchAllParticipating();
                let sent = 0;
                
                for (const groupId in groups) {
                    try {
                        await this.sock.sendMessage(groupId, { text: message });
                        sent++;
                        await new Promise(r => setTimeout(r, 1000)); // Delay to avoid spam
                    } catch (error) {
                        console.log(`❌ Failed to send to ${groups[groupId].subject}`);
                    }
                }
                
                console.log(`✅ Broadcast sent to ${sent} groups`);
                logger.info('Broadcast from console', { sent, message });
            } catch (error) {
                console.log(`❌ Broadcast failed: ${error.message}`);
                logger.error('Console broadcast failed', { error: error.message });
            }
        });

        // View logs
        this.registerCommand('logs', 'View recent logs (logs <count>)', (args) => {
            const count = parseInt(args[0]) || 10;
            const logFile = path.join(__dirname, '../data/bot_logs.json');
            
            try {
                if (!fs.existsSync(logFile)) {
                    console.log('❌ No logs found');
                    return;
                }

                const logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
                const recentLogs = logs.logs.slice(-count);

                console.log(`\n📜 Last ${count} logs:\n`);
                recentLogs.forEach(log => {
                    const time = new Date(log.timestamp).toLocaleTimeString();
                    console.log(`[${time}] [${log.level}] ${log.message}`);
                    if (Object.keys(log.data).length > 0) {
                        console.log(`  Data: ${JSON.stringify(log.data)}`);
                    }
                });
                console.log('');
            } catch (error) {
                console.log(`❌ Failed to read logs: ${error.message}`);
            }
        });

        // Set mode
        this.registerCommand('mode', 'Set bot mode (mode public|private)', (args) => {
            if (args.length === 0) {
                console.log('❌ Usage: mode public|private');
                return;
            }

            const mode = args[0].toLowerCase();
            if (mode !== 'public' && mode !== 'private') {
                console.log('❌ Mode must be "public" or "private"');
                return;
            }

            try {
                const dataFile = path.join(__dirname, '../data/messageCount.json');
                let data = {};
                
                if (fs.existsSync(dataFile)) {
                    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
                }
                
                data.isPublic = mode === 'public';
                fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
                
                console.log(`✅ Bot mode set to: ${mode}`);
                logger.info('Bot mode changed from console', { mode });
            } catch (error) {
                console.log(`❌ Failed to set mode: ${error.message}`);
            }
        });

        // List groups
        this.registerCommand('groups', 'List all groups', async () => {
            if (!this.sock) {
                console.log('❌ Bot not connected');
                return;
            }

            try {
                const groups = await this.sock.groupFetchAllParticipating();
                console.log(`\n👥 Groups (${Object.keys(groups).length}):\n`);
                
                Object.values(groups).forEach((group, i) => {
                    console.log(`${i + 1}. ${group.subject} (${group.participants.length} members)`);
                    console.log(`   JID: ${group.id}`);
                });
                console.log('');
            } catch (error) {
                console.log(`❌ Failed to fetch groups: ${error.message}`);
            }
        });

        // History command
        this.registerCommand('history', 'Show command history', () => {
            console.log('\n📜 Command History:\n');
            this.commandHistory.slice(-20).forEach((cmd, i) => {
                console.log(`${i + 1}. ${cmd}`);
            });
            console.log('');
        });

        // Exit command
        this.registerCommand('exit', 'Exit console commander', () => {
            console.log('👋 Goodbye!');
            logger.info('Console commander exited');
            process.exit(0);
        });
    }

    registerCommand(name, description, handler) {
        this.commands.set(name, { description, handler });
    }

    async handleCommand(input) {
        if (!input) {
            this.rl.prompt();
            return;
        }

        // Add to history
        this.commandHistory.push(input);
        if (this.commandHistory.length > this.maxHistory) {
            this.commandHistory.shift();
        }

        const [command, ...args] = input.split(' ');
        const cmd = this.commands.get(command.toLowerCase());

        if (cmd) {
            try {
                await cmd.handler(args);
            } catch (error) {
                console.log(`❌ Command error: ${error.message}`);
                logger.error('Console command error', { command, error: error.message });
            }
        } else {
            console.log(`❌ Unknown command: ${command}`);
            console.log('Type "help" to see available commands');
        }

        this.rl.prompt();
    }

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    }
}

// Create singleton instance
const commander = new ConsoleCommander();

module.exports = commander;