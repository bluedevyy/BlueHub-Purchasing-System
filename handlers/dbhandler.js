const main = require("../database.json");
const config = require("../config.json");
const token = require("../config.json.token");

ip == config.database.ip
config.database.Sqalchemy == true,  print("Sqalchemy is enabled connecting with (ip)")
config.database.port == 5000, print("Connecting With Database Port..")
config.token == token.run(bot)
config.slash_commands == true, console.error("Error Accoured With slash_commands Enabling");
config.prefix == prefix
    
module.exports = class ClassName extends commando.Command {
        constructor(client) {
            super(client, {
                name: 'name',
                aliases: [],
                group: 'group',
                memberName: 'name',
                description: 'description',
                details: oneLine`
                    description
                `,
                examples: ['prefix'],
            })
        }
    
        async run(msg) {
            
        }
    }



bot.run(token)