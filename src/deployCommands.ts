export async function deployCommands() {

    const { REST, Routes } = require('discord.js');
    const { clientId, guildId, token } = require('./config.json');
    const fs = require('node:fs');
    const path = require('node:path');

    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[DEPLOY COMMANDS] WARNING The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    const rest = new REST().setToken(token);

    await (async () => {
        try {
            console.log(`[DEPLOY COMMANDS] Started refreshing ${commands.length} application (/) commands.`);

            const data = await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );

            console.log(`[DEPLOY COMMANDS] Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            console.error(error);
        }
    })();

}
