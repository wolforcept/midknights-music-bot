import Bot from './Bot';
import Data from './Data';
import DiscordAppClient from './DiscordAppClient';
import Driver from './Driver';
import 'dotenv/config'

const token = process.env.TOKEN;
const messageId = process.env.MESSAGE_ID;
const channelId = process.env.CHANNEL_ID;
const pathToChrome = process.env.PATH_TO_CHROME;
const pathToAdblock = process.env.PATH_TO_ADBLOCK;

// {
//     "command": "runCommands",
//     "key": "alt+shift+c", // whatever keybinding you want
//     "args": {
//         "commands": [
//             // "workbench.action.terminal.clear",
//             {
//                 "command": "workbench.action.terminal.sendSequence",
//                 "args": {
//                     "text": "asdasdasd"
//                 }
//             }
//         ]
//     },
//     "when": "editorTextFocus" // can use context keys
// }

async function start() {

    let data = new Data();
    await data.init();

    let discord: DiscordAppClient;
    let driver: Driver;
    let bot: Bot;
    let queue: string[] = [];
    let channel: string = await data.getChannel();

    function makeMessage() {

        const playingMessage = driver.isPlaying()
            ? `Now Playing: ${driver.getCurrent()}`
            : "Nothing is playing...";

        const queueMessage = queue.length > 0
            ? `
            Queue:
            ${queue.map(x => " - " + x).join('\n')}`
            : "";

        return `
**Midknights Music Bot**

available commands:
\`\`\`
play <url or search text>    - plays or adds the video to the queue
pause                        - pauses / unpauses*
skip                         - skips the current video*
stop                         - stops the browser and leaves the channel
channel <channel name>       - sets the bot default channel (and moves it)
\`\`\`
*doesn't work for auto played videos

Channel: ${channel}
**${playingMessage}**
${queueMessage}

`
    }

    function update() {
        bot.updateMessage(makeMessage())
    }

    function onVideoEnd() {
        console.log("[MESSAGE] Video End!");
        if (queue.length > 0) {
            const next = queue.splice(0, 1)[0];
            driver.play(next);
        } else {
            update()
        }
    }

    function onVideoChanged(nowPlaying: string) {
        console.log("[MESSAGE] Video Changed: " + nowPlaying);
        update()
    }

    function onStarted() {
        update()
    }

    async function onPlayMessage(text: string) {
        console.log("[MESSAGE] Play: " + text);
        if (driver.isPlaying()) {
            queue.push(text)
        } else {
            await discord.enterChannel("MidKnights Keep");
            await driver.play(text)
        }
        update()
    }

    function onPauseMessage() {
        console.log("[MESSAGE] Pause");
        if (driver.isPlaying()) {
            driver.pauseUnpause();
        }
        update()
    }

    function onSkipMessage() {
        console.log("[MESSAGE] Skip");
        if (driver.isPlaying() && queue.length > 0) {
            const next = queue.splice(0, 1)[0];
            driver.play(next);
        }
        update()
    }

    function onChannelMessage(name: string) {
        console.log("[MESSAGE] Channel change: " + name);
        channel = name;
        discord.enterChannel(channel)
        update()
    }

    function onStopMessage() {
        console.log("[MESSAGE] Stop");
        driver.stop();
        discord.leaveChannel();
        queue.splice(0, queue.length);
        update()
    }

    function onQueueMessage() {
        console.log("[MESSAGE] Queue");
        update();
    }

    driver = new Driver(
        { pathToChrome, pathToAdblock, },
        { onVideoChanged, onVideoEnd, }
    );

    bot = new Bot(
        { token, messageId, channelId, },
        { onStarted, onPlayMessage, onPauseMessage, onSkipMessage, onChannelMessage, onStopMessage, onQueueMessage }
    );

    discord = new DiscordAppClient(
        { pathToChrome }
    );

    discord.init();
}

start();

// TODO:
// SEE QUEUE COMMAND
// DEPLOY AND TEST
// CHECK/REMAKE BROWSER WINDOW IF CLOSED