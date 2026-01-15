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
 require('dotenv').config();

global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};

global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux'
};

module.exports = {
    WARN_COUNT: 3,
    APIs: global.APIs,
    APIKeys: global.APIKeys
};