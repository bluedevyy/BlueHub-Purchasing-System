/*
    HUB-LINKBOT (jdwoj5)
    Please view the README before getting started. (Please run node server.js when starting up the bot, not node handler.js.)
*/
const { spawn } = require('child_process');
const Discord = require('discord.js')
const fs = require('fs');
const config = require('./config.json');

const bot = new Discord.Client({
    presence: {
        status: 'idle',
        activity: {
            name: 'BlueHub V1.1',
            type: 'PLAYING'
        }
    }
})
bot.on('ready', async () => {
    fs.readFile('restart.json', 'utf8', async function (err, data) {
        if (err) {
            bot.destroy()
            process.exit()
        } else {
            let information = JSON.parse(data);
            let channel = await bot.channels.fetch(information.messageChannel)
            let msg = await channel.messages.fetch(information.message)
            let ThisEmbed = new Discord.MessageEmbed()
                .setColor(Number(process.env.BOT_EMBEDCOLOR))
                .setAuthor(information.author.username, information.author.displayAvatarURL)
                .setTitle('**Restart Information**')
                .addField('Restart Status', ':x: **Error found! Manual Restart required.**')
                .addField('Error Catch Time', (Date.now() - information.initialized) / 1000 + ' seconds')
                .setThumbnail(information.author.guildIcon)
            await msg.edit(ThisEmbed)
            console.log('PROCESS | Updated Restart Information!')
            bot.destroy()
            process.exit()
        } 
    });
})

let full;
function StartBot(arg) {
    if (!arg) full = spawn('node', ['handler.js']);
    else full = spawn('node', ['handler.js', arg]);
    full.stdout.on('data', (data) => {
        console.log(String(data).trim());
    });
      
    full.stderr.on('data', (data) => {
        console.error(String(data));
    });
            bot.login(config.token)
        }
        if (code == 2) {
            StartBot('--restarted')
        }

StartBot()