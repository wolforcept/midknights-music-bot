import { Client, Events, GatewayIntentBits, TextChannel } from 'discord.js';
import { sendToServer } from "./comms";

const { token } = require('../config.json');
const CHANNEL_ID = "1152187044462858250";
const MESSAGE_ID = "1152193820088344586";

export interface Bot {
    updateMessage: (argss: undefined | { nowPlaying: string, queue: Array<string> }) => void
}

export async function startBot(): Promise<Bot> {

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    });
    client.once(Events.ClientReady, c => {
        console.log(`[BOT] Ready! Logged in as ${c.user.tag}`);
    });

    // const commands = new Map<string, any>();
    // const commandsPath = path.join(__dirname, 'commands');
    // const commandFiles = fs.readdirSync(commandsPath).filter((file: string) => file.endsWith('.js'));

    // for (const file of commandFiles) {
    //     const filePath = path.join(commandsPath, file);
    //     const command = require(filePath);
    //     // Set a new item in the Collection with the key as the command name and the value as the exported module
    //     if ('data' in command && 'execute' in command) {
    //         commands.set(command.data.name, command);
    //     } else {
    //         console.log(`[BOT] Warning! The command at ${filePath} is missing a required "data" or "execute" property.`);
    //     }
    // }

    client.on(Events.MessageCreate, async interaction => {
        if (interaction.channelId !== CHANNEL_ID) return

        try {
            let text = interaction.content;

            let response;
            if (text.toLocaleLowerCase().startsWith("play"))
                response = await sendToServer("play", text.substring(5));
            updateMessage(response);

        } catch (e) {
            console.log("[BOT] " + e)
        }
    })

    // client.on(Events.InteractionCreate, async interaction => {
    //     if (!interaction.isChatInputCommand()) return;

    //     const command = commands.get(interaction.commandName);

    //     if (!command) {
    //         console.error(`No command matching ${interaction.commandName} was found.`);
    //         return;
    //     }

    //     try {
    //         await command.execute(interaction);
    //     } catch (error) {
    //         console.error(error);
    //         if (interaction.replied || interaction.deferred) {
    //             await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    //         } else {
    //             await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    //         }
    //     }
    // });

    await client.login(token);

    async function updateMessage(argss: undefined | { nowPlaying: string, queue: Array<string> }) {
        console.log("[BOT] updating queue:")
        const { nowPlaying, queue } = argss ?? await sendToServer("queue")
        console.log("[BOT] " + nowPlaying + " " + queue)

        let answer = "Now playing: " + nowPlaying;
        if (queue && queue.length > 0) answer += "\nUp next:\n > " + queue.join("\n > ");

        const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
        if (!channel) return;
        const messages = await channel.messages.fetch({ limit: 100 })
        messages.forEach(async message => {
            if (message.id === MESSAGE_ID) message.edit(answer)
            else message.delete().catch(() => { })
        })
    }

    return { updateMessage } as Bot

    // // `m` is a message object that will be passed through the filter function
    // const collectorFilter = m => m.content.includes('discord');
    // const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 15000 });

    // collector.on('collect', m => {
    // 	console.log(`Collected ${m.content}`);
    // });

    // collector.on('end', collected => {
    // 	console.log(`Collected ${collected.size} items`);
    // });

    // discord.on('messageReactionAdd', (reaction) => {
    //     if (reaction.message.id !== 'A1') return
    //     // Your code ...
    //     console.log(reaction)
    // })
    // discord.on('messageReactionRemove', (reaction) => {
    //     if (reaction.message.id !== 'A1') return
    //     // Your code ...
    //     console.log(reaction)
    // })

}
