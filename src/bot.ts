import { Client, Events as DiscordEvents, FetchMessagesOptions, GatewayIntentBits, Guild, Message, MessageReaction, MessageResolvable, PartialMessageReaction, TextChannel } from "discord.js";
import UTIL from "./Util";

export default class Bot {

    private client: Client;

    constructor(
        private info: {
            token: string,
            messageId: string,
            channelId: string,
        },
        private actions: {
            onStarted: () => void,
            onPlayMessage: (text: string) => void,
            onPauseMessage: () => void,
            onSkipMessage: () => void,
            onStopMessage: () => void,
            onChannelMessage: (text: string) => void,
            onQueueMessage: () => void,
        }
    ) {

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        });

        this.client.once(DiscordEvents.ClientReady, c => console.log(`[BOT] Ready! Logged in as ${c.user.tag}`));
        this.client.on(DiscordEvents.MessageCreate, x => this.onDiscordMessage(x))
        this.client.on(DiscordEvents.MessageReactionAdd, x => this.onDiscordReaction(x))
        this.client.login(this.info.token).then(() => this.actions.onStarted());
    }

    private async getChannel(): Promise<TextChannel> {
        try {
            const channel = await this.client.channels.fetch(this.info.channelId);
            return channel as TextChannel;
        } catch (e) {
            console.log("[DATA] " + e)
        }
    }

    private async onDiscordReaction(interaction: MessageReaction | PartialMessageReaction) {
        try {
            // interaction.message.reactions.removeAll()
        } catch (e) {
            console.log("[BOT] " + e)
        }
    }

    private async onDiscordMessage(message: Message<boolean>) {
        try {

            if (message.channelId !== this.info.channelId) return

            const text = message.content.toLocaleLowerCase();
            await UTIL.sleep(500)
            message.delete()

            if (text.startsWith("play ")) {
                // const guild = Client.guilds.cache.get("GuildID");
                // const Member = guild.members.cache.get("UserID");
                // message.author.client.voice.
                // const user = this.client.users.cache.get(message.author.id);
                this.actions.onPlayMessage(text.substring(5))
            }
            if (text.startsWith("pause") || text.startsWith("unpause"))
                this.actions.onPauseMessage();
            if (text.startsWith("skip"))
                this.actions.onSkipMessage();
            if (text.startsWith("stop"))
                this.actions.onStopMessage();
            if (text.startsWith("channel "))
                this.actions.onChannelMessage(text.substring(8));
            if (text.startsWith("queue"))
                this.actions.onQueueMessage();
        } catch (e) {
            console.log("[BOT] " + e)
        }
    }

    async updateMessage(text: string) {
        try {
            const channel = await this.getChannel();
            // const messages = await channel.messages.fetch({ limit: 100 });
            const message = await channel.messages.fetch(this.info.messageId);
            message.edit(text)

            if (Math.random() < .1) {
                const messages = await channel.messages.fetch({ limit: 100 })
                messages.forEach(async message => {
                    if (message.id !== this.info.messageId && message.author.username != 'MidknightsBot')
                        message.delete().catch(() => { })
                })
            }
        } catch (e) {
            console.log("[BOT] " + e)
        }
    }

    // this.player.nowPlaying + " " + this.player.queue.join(", ");
    // let answer = '';
    // answer += EXPLANATION;
    // answer += "Now playing: " + nowPlaying;
    // if (queue && queue.length > 0) answer += "\nUp next:\n > " + queue.join("\n > ");

    // const channel = await client.channels.fetch(CHANNEL_ID) as TextChannel;
    // if (!channel) return;
    // const messages = await channel.messages.fetch({ limit: 100 })
    // messages.forEach(async message => {
    //     if (message.id === MESSAGE_ID) message.edit(answer)
    //     else if (message.author.username != 'MidknightsBot') message.delete().catch(() => { })
    // })


}